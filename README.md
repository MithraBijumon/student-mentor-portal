# Student Mentor Portal

A mobile-first student-mentor interaction platform powered by **Django (backend)** and **React Native / Flutter (frontend)**.

## 🔧 Features

- 🎓 Register using roll number + email verification
- 👨‍🏫 Mentors assigned beforehand (stored in DB)
- 💬 Discussion Forum:
  - Post doubts (with anonymous option)
  - Highlighted mentor responses
  - Reply threads
- 📩 Direct messaging between students and mentors
- 🔎 Similar question suggestions while typing
- 📢 Announcements page (mentors only)
- 🧑‍💼 Mentor directory with profiles and DM access

## 🔗 Tech Stack

| Layer        | Stack              |
|--------------|--------------------|
| Backend      | Django, DRF (API)  |
| Frontend     | React Native / Flutter |
| Auth & Email | Django built-in auth + custom email verify |
| DB           | SQLite (dev) / PostgreSQL (prod) |
| Version Ctrl | Git + GitHub       |

## 🛠️ Setup Instructions

### Backend (Django)

```bash
git clone https://github.com/MithraBijumon/student-mentor-portal.git
cd student-mentor-portal
python -m venv venv
.\venv\Scripts\Activate   # Windows
pip install django djangorestframework
django-admin startproject backend
cd backend
python manage.py startapp core
