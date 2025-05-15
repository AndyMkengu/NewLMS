from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    start = db.Column(db.DateTime, nullable=False)  # ISO format string
    end = db.Column(db.DateTime)  # ISO format string
    color = db.Column(db.String(20), default='#162e6b')
    event_type = db.Column(db.String(50), default='general')
    course = db.Column(db.String(100), default='General')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    all_day = db.Column(db.Boolean, default=False)
    location = db.Column(db.String(200))
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'start': self.start,  # Must be in ISO format
            'end': self.end,  # Must be in ISO format
            'color': self.color,
            'allDay': self.all_day,
            'extendedProps': {
                'type': self.event_type,
                'course': self.course,
                'location': self.location,
                'description': self.description
            }
        }

    @classmethod
    def from_dict(cls, data):
        """Create event from dictionary"""
        return cls(
            title=data.get('title', 'New Event'),
            start=data.get('start'),
            end=data.get('end', data.get('start')),
            color=data.get('color', '#162e6b'),
            event_type=data.get('extendedProps', {}).get('type', 'general'),
            course=data.get('extendedProps', {}).get('course', 'General'),
            all_day=data.get('allDay', False),
            location=data.get('extendedProps', {}).get('location', ''),
            description=data.get('extendedProps', {}).get('description', '')
        )


from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


