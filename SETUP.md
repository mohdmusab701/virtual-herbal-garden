# Virtual Herbal Garden setup and verification

## Architecture

```text
Next.js frontend (http://localhost:3000)
        |
        v
Express API (http://localhost:5000)
        |-- MongoDB
        |
        `-- 
```

The browser calls only the Express API. Express authenticates requests, validates image content, and persists scan records in MongoDB. With `MOCK_AI_MODE=true` in development, the Node backend returns an explicitly labeled simulated scanner result without calling an AI service. This is not a real plant identification or AI prediction; no Python, model, or FastAPI service is needed for this development mode. Authentication, scanner persistence, history, and other database-backed features still require MongoDB; the API will fail to start when MongoDB is unavailable.

## Current verification status

| Component                  | Status                                        | Verification                                                                                                                | Remaining blocker                                                                                     |
| -------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Express/TypeScript backend | Build and mock scan verified                 | TypeScript build passed; authenticated mock scan returned an explicit simulation with no confidence and appeared in history on an isolated local database | MongoDB is required for auth and persisted features                                                   |
| MongoDB                    | Local database reachable                    | Read-only ping to `127.0.0.1:27017` passed; the previously reported Atlas SRV lookup currently resolves                     | If Atlas DNS errors recur, use the local MongoDB URI in the startup command                           |
| Next.js frontend           | Lint and production build passed             | ESLint completed with zero errors; production build passed                                                                   | Four non-blocking image/font lint warnings remain                                                     |
| FastAPI service            | Not runnable on this machine                  | Python source compiles with installed Python 3.12.9; service dependencies are not installed                                 | Python 3.10 is absent; existing `venv` points to Python 3.12, but that interpreter path is missing    |
| Plant inference            | Unavailable                                   | No `.pt` weights were found; the checked-in YAML has five replaceable example class names, not verified model metadata      | Provide authorized, compatible weights at `virtualgarden-ai/models/yolo/best.pt`, or set `MODEL_PATH` |
| Disease detection          | Explicitly unavailable                        | Node endpoint returns HTTP 503; no disease model was found                                                                  | Provide a separately verified disease-trained model and defined API contract                          |
| 3D reconstruction          | Unavailable                                   | No COLMAP executable, reconstruction dataset, checkpoint, or GLB asset was found                                            | Install COLMAP and provide distinct multi-view images; then generate and validate an actual GLB       |

## Local machine notes

- Node.js `v24.16.0`, npm `11.13.0`, and the checked-in Node dependency folders are present.
- PowerShell execution policy blocks `npm.ps1`; use `npm.cmd` in PowerShell commands below.
- The Python Launcher (`py`) is installed, but `py -0p` lists only Python 3.12.9; Python 3.10 is not installed. Python 3.10 is required by the AI repository README.
- Do not delete the existing `virtualgarden-ai/venv`; it is currently unusable because its `pyvenv.cfg` points to a missing Python 3.12 installation. Recreate it only after Python 3.10 is installed.
- The former frontend `.next` directory is a read-only OneDrive reparse point. `next.config.ts` uses `.next-build` normally and supports an alternate `NEXT_DIST_DIR`; `.next-verify` was used for the verified production build without stopping the dev server.
- At the latest check, local MongoDB accepted a read-only ping on port 27017 and the Atlas SRV DNS lookup resolved. The reported `querySrv ECONNREFUSED` did not reproduce as a DNS lookup failure. The commands below explicitly use local MongoDB and leave all `.env` files unchanged.

## Environment configuration

Do not overwrite existing `.env` or `.env.local` files and never commit them.

The frontend API URL points to the Express API at `http://localhost:5000`. In development Mock AI mode, plant scans do not call FastAPI or any external AI service.

Set `MONGODB_URI` to the local MongoDB URI and `MOCK_AI_MODE=true` in the backend PowerShell process as shown under Start the application. These process-local overrides do not read or change `.env` files.

In development, `MOCK_AI_MODE=true` returns a clearly labeled simulated placeholder with no confidence score. Mock results must not be presented as real predictions. Mock mode does not bypass authentication or MongoDB persistence. Keep the existing `.env` files private and unchanged. `MONGODB_URI` and `JWT_SECRET` are required. Cloudinary variables are optional; without them, scans still work but no durable image URL is stored in history.

## MongoDB installation and safe testing

The existing Atlas URI successfully connected and answered a read-only admin ping. Its URI and credentials were not displayed, and no application collections or data were accessed. A local `mongod` process also answered a ping for the dedicated `herbiva_ai_test` database, and the Jest suite passed using only that database. Do not use the Atlas/production URI for tests. The local listener may not be registered as a Windows service; use it for isolated tests only and do not stop or reconfigure it without checking its owner.

If choosing a new local MongoDB installation instead, follow the official [MongoDB Community Windows installation guide](https://www.mongodb.com/docs/manual/administration/install-community/). Do not install another instance while the current local listener is active.

For an already installed MongoDB Windows service, an administrator can inspect/start it without changing database contents:

```powershell
Get-Service -Name MongoDB
Start-Service -Name MongoDB
```

If the project is meant to use a managed or remote MongoDB deployment, do not install a local server as a substitute. Instead, correct the existing `MONGODB_URI` through the usual secret-management path. Never use that URI for automated tests. Set `MONGODB_TEST_URI` only to a separately provisioned, isolated test database before running Jest.

## Install the Python prerequisite and AI environment

The Python Launcher is installed, but only Python 3.12.9 is registered. The repository README requires Python 3.10. Note the support tradeoff: Python 3.10 reached end of life on 2026-10-01. The final 3.10 release, 3.10.22, is source-only with no Windows installer; 3.10.11 is the last 3.10 release with an official Windows x64 installer and is also outside security support. Do not downgrade or replace Python 3.12. If you accept the legacy-runtime risk for this project, manually download the official [Python 3.10.11 Windows x64 installer](https://www.python.org/downloads/release/python-31011/) and install side-by-side. Keep the Python Launcher enabled, install pip, and avoid changing the global/default Python PATH. Reopen PowerShell and verify `py -0p` lists 3.10. If you do not accept an unsupported interpreter, approve a project dependency/runtime compatibility check on Python 3.12 before proceeding. No installer was downloaded or run in this session.

Leave the broken `venv` directory untouched. The following creates a new, independent environment instead:

```powershell
py -3.10 --version
Set-Location 'C:\Users\mohdm\OneDrive\Documents\Desktop\Herbiva AI\virtualgarden-ai'
py -3.10 -m venv .venv310
.\.venv310\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip check
```

The full requirements set cannot be resolved or tested until Python 3.10 is installed. Requirements are largely unpinned and include CPU PyTorch, Ultralytics, FastAPI, OpenCV, Open3D, and scientific packages; compatibility together remains unverified on this Windows machine. Do not install a CUDA wheel for this CPU-oriented project.

Place only the authorized, trained YOLO weights at:

```text
virtualgarden-ai\models\yolo\best.pt
```

Alternatively, set `MODEL_PATH` for the current shell to the absolute path of a compatible local `.pt` file. The repository README documents a Google Drive training folder as its source and claims it contains `best.pt`, a training notebook, and results. The folder contents were not verified or downloaded in this session; no checksum or model metadata is committed. Inspect the documented drive folder manually and verify provenance, training dataset, and embedded class names before downloading/using weights. The only checked-in class list is a configurable example (`rose`, `sunflower`, `tulip`, `daisy`, `orchid`) and is not proof of the missing model's labels.

Start and check FastAPI after the dependencies and weights are ready:

```powershell
Set-Location 'C:\Users\mohdm\OneDrive\Documents\Desktop\Herbiva AI\virtualgarden-ai'
.\.venv310\Scripts\Activate.ps1
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
Invoke-RestMethod http://127.0.0.1:8000/health
```

`/health` must report `model_loaded: true` and `inference_ready: true` before a real image inference can be attempted. The real Node-compatible endpoint is `POST /predict/plant` with multipart field name `file`; it returns only the model's actual labels, confidences, and boxes.

## Start the application

Start MongoDB first, then use two PowerShell terminals. The local MongoDB URI below is a per-terminal override; it does not change `.env` or connect to Atlas.

```powershell
# Terminal 1: Express API
Set-Location 'C:\Users\mohdm\OneDrive\Documents\Desktop\virtual herbal garden\backend'
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/herbiva_ai_dev' # local-only; leaves Atlas .env untouched
$env:MOCK_AI_MODE = 'true'
npm.cmd run dev
```

```powershell
# Terminal 2: Next.js frontend
Set-Location 'C:\Users\mohdm\OneDrive\Documents\Desktop\virtual herbal garden\frontend'
npm.cmd run dev
```

Local URLs:

- Frontend: `http://localhost:3000`
- Express health: `http://localhost:5000/api/health`
- Express docs: `http://localhost:5000/api/docs`

## Tests and checks

```powershell
# Backend build
Set-Location 'C:\Users\mohdm\OneDrive\Documents\Desktop\virtual herbal garden\backend'
npm.cmd run build

# Backend API tests: dedicated local test DB only; never substitute Atlas
$env:MONGODB_TEST_URI = 'mongodb://127.0.0.1:27017/herbiva_ai_test'
npm.cmd test -- --runInBand
Remove-Item Env:\MONGODB_TEST_URI

# Frontend
Set-Location 'C:\Users\mohdm\OneDrive\Documents\Desktop\virtual herbal garden\frontend'
npm.cmd run lint
$env:NEXT_DIST_DIR = '.next-verify'
npm.cmd run build
Remove-Item Env:\NEXT_DIST_DIR

# Python, after Python 3.10 and requirements are installed
Set-Location 'C:\Users\mohdm\OneDrive\Documents\Desktop\Herbiva AI\virtualgarden-ai'
.\.venv310\Scripts\Activate.ps1
python -m pytest
```

The backend test suite refuses to run without `MONGODB_TEST_URI` instead of deriving a database name from the production configuration. It uses unique test accounts and does not delete users or reset collections. It passed 6/6 against the dedicated local test DB. Separate live API smoke checks verified register, login, bearer-authenticated profile, and scan history on local `herbiva_ai_dev` without printing tokens. The declared backend `npm.cmd run lint` script is not runnable because ESLint is not installed or configured in `backend/`; TypeScript compilation is the available static backend check. The running Next.js dev server may hold `.next-build`; use `.next-verify` as above for a parallel production build. `eslint.config.mjs` ignores generated build output including `.next-verify`.

## 3D reconstruction

The source includes a COLMAP/Tiny-NeRF/GLB pipeline, but no input dataset, COLMAP executable, NeRF checkpoint, or generated GLB is included. After supplying distinct overlapping images of one plant and installing COLMAP, run:

```powershell
Set-Location 'C:\Users\mohdm\OneDrive\Documents\Desktop\Herbiva AI\virtualgarden-ai'
.\.venv310\Scripts\Activate.ps1
python -m reconstruction.run_all --species <scene-name> --images_dir <path-to-images>
```

The expected export location is `models/nerf_exports/<scene-name>/<scene-name>.glb`. Do not treat the frontend's procedural React Three Fiber garden as reconstructed output. Validate a real GLB before connecting it to the garden UI.

## Exact remaining manual steps

1. **Python prerequisite:** decide whether to accept the unsupported Python 3.10 runtime risk. If yes, install Python 3.10.11 x64 from the official release link above, side-by-side with 3.12.9. Open a fresh PowerShell and verify `py -0p`, then create `.venv310` and install requirements using the commands above. Do not remove `virtualgarden-ai/venv`.
2. **YOLO weights:** manually inspect the README-linked Google Drive folder. Confirm `best.pt` is the authorized project-trained plant model and check its embedded class names/training documentation. Do not use generic YOLO weights. Download/copy it to `virtualgarden-ai\models\yolo\best.pt` only after verifying it.
3. **Start Python:** with `.venv310` active, run the Uvicorn command above. Confirm `/health` returns `model_loaded: true` and `inference_ready: true`; if weights or dependencies are unavailable, resolve those issues rather than enabling fake results.
4. **Enable live inference only after readiness:** in the Node API PowerShell terminal, set `$env:MOCK_AI_MODE = 'false'` for that process, and retain `$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/herbiva_ai_dev'` for local development. Restart Node and check `/api/health` reports FastAPI reachable and model ready. These session variables do not edit either `.env` file.
5. **Validate a real scan:** register/sign in on the frontend, upload a valid JPEG/PNG/WebP of at most 10 MB, then confirm the returned scan/history shows actual model output. An empty result is not a diagnosis.
6. **Optional 3D work:** install COLMAP and supply distinct overlapping plant photos only if reconstruction is needed. Run the documented pipeline and confirm a real GLB exists before using it in a viewer. Disease detection remains unavailable unless its own trained model is verified.

## Files changed during this verification

- Backend `src/server.ts`, `src/config/env.ts`, `src/config/cloudinary.ts`, `src/services/ai.service.ts`, `src/services/cloudinary.service.ts`, `src/controllers/scan.controller.ts`, `src/controllers/disease.controller.ts`, `src/models/PlantScan.ts`, and `tests/api.test.ts` - real AI response validation, safe scan metadata/errors, no fake disease/plant predictions, isolated test database checks, and accurate startup messaging.
- `backend/.env.example` and `.gitignore` - safe local defaults and secret-file ignore rules; real `.env` files were not changed.
- `frontend/next.config.ts`, `tsconfig.json`, `.gitignore`, and `eslint.config.mjs` - support/ignore `.next-build` and `.next-verify` for builds beside the active dev server.
- `frontend/src/lib/api/auth.ts` and `src/hooks/use-mock-auth.ts` - synchronize browser auth state without an invalid synchronous effect.
- Frontend scanner API/pages/components, dashboard/history, types, and login/register pages - authenticated uploads/history, progress/errors, and model-only display.
- `frontend/src/lib/api/plants.ts` - preserves Express as the fallback browser API host.
- `frontend/src/components/chat/chat-interface.tsx` and `src/components/garden/garden-scene.tsx` - remove impure render-time values flagged by the React lint rules.
- `virtualgarden-ai/backend/main.py`, `backend/model_loader.py`, and `detection/train.py` - validated inference API, configured-weight readiness/no generic fallback, and environment-supplied Roboflow key.
- `virtualgarden-ai/tests/test_backend.py` and `tests/test_detection.py` - align tests with the current FastAPI root contract and detection utility API.

No lockfiles, environment files, Atlas data, model files, or 3D assets were changed. The isolated tests/API checks inserted random accounts into local `herbiva_ai_test` and `herbiva_ai_dev`; tests do not delete/reset data. The currently running Node process is connected only to `herbiva_ai_dev`.
