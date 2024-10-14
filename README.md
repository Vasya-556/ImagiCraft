# ImagiCraft

[ImagiCraft Website]()  

# Table of Contents
- [ImagiCraft](#imagicraft)
- [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Usage](#usage)
  - [Installation](#installation)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Create virtual enviroment for python](#2-create-virtual-enviroment-for-python)
    - [3. Run backend server](#3-run-backend-server)
    - [4. Run frontend server](#4-run-frontend-server)
  - [Contributing](#contributing)
  - [License](#license)

## Description

This web app lets you create images using AI. It is built with React.js for the front end and Django for the back end. Just type in a prompt, and the app generates unique images for you!
![](image.png)

## Usage

- Go to the website
- In the field bellow enter your prompt
- Press download to save image
- You can sign in/up to generate 3 image's at once
- You can change info about yourself on profile page
- If you logged in your prompt history is saved on history page

## Installation

Follow these steps to get started

### 1. Clone the Repository
```bash
git clone https://github.com/Vasya-556/Converter.git
cd Converter
```

### 2. Create virtual enviroment for python
```bash
python -m venv env
# On Windows
env\Scripts\activate
# On macOS/Linux
source env/bin/activate
cd backend
pip install -r requirements.txt
```

### 3. Run backend server
```bash
cd backend
python manage.py migrate
python manage.py runserver
```

### 4. Run frontend server
```bash
cd frontend
npm start
```

## Contributing

Pull requests are welcome.

## License

[MIT](LICENSE)