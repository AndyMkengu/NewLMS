from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from datetime import datetime
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from event_model import db, Event, User

app = Flask(__name__, template_folder='templates', static_folder='static')

# Database configuration
app.config['SECRET_KEY'] = 'Sikhulile12345'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid email or password', 'danger')

    return render_template('login.html')


# Logout route
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


# Protected route example
@app.route('/home')
@login_required
def home():
    return render_template('home.html', user=current_user)


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


@app.route('/courses')
def courses():
    return render_template('courses.html')


@app.route('/notifications')
def notifications():
    return render_template('notifications.html')


@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/login')
def login():
    return render_template('login.html')


# Event API Routes
@app.route('/api/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([event.to_dict() for event in events])


@app.route('/api/events', methods=['POST'])
def add_event():
    data = request.get_json()
    try:
        new_event = Event.from_dict(data)
        db.session.add(new_event)
        db.session.commit()
        return jsonify({
            'success': True,
            'event': new_event.to_dict()  # Make sure this matches FullCalendar's expected format
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    data = request.get_json()

    event.title = data.get('title', event.title)
    event.start = data.get('start', event.start)
    event.end = data.get('end', event.end)
    event.color = data.get('color', event.color)
    event.event_type = data.get('extendedProps', {}).get('type', event.event_type)
    event.course = data.get('extendedProps', {}).get('course', event.course)
    event.all_day = data.get('allDay', event.all_day)
    event.location = data.get('extendedProps', {}).get('location', event.location)
    event.description = data.get('extendedProps', {}).get('description', event.description)

    db.session.commit()
    return jsonify({'success': True, 'event': event.to_dict()}), 200


@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'success': True}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)