from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired


class EditUserForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    avatar = StringField('Avatar')
    bio = StringField('Bio')
