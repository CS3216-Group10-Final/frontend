# DisplayCase

## URL: [https://www.displaycase.me/](https://www.displaycase.me/)

### Members

| Frontend                | Backend                       |
| ----------------------- | ----------------------------- |
| Dasco Gabriel A0224199X | Lui Kai Siang A0217985M       |
| Lee Zen Been A0218515H  | Bernard Wan De Yuan A0218499L |

### Set-up instructions for local testing

- Frontend
  - Navigate to /frontend directory
  - `yarn install` to install dependencies
  - `yarn dev` to set-up local development server on localhost:3000
- Backend
  - Navigate to /backend directory
  - `virtualenv venv` to set up a new virtual environment
  - `source venv/bin/activate` to activate the virtual environment
  - `pip install -r requirements.txt` to install the required packages
  - `python manage.py migrate` to run the migrations and create a database
  - `python managepy runserver` to set-up local development server on localhost:8000
- Accounts for testing (only on production server)
  - Account 1
    - Email: gamer@gmail.com
    - Password: Gamer1!!
  - Account 2
    - Email: gamer2@gmail.com
    - Password: Gamer2!!
  - Account 3
    - Email: gamer3@gmail.com
    - Password: Gamer3!!
