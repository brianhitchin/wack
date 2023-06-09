from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Message, Reaction, User, Attachment
from app.forms import MessageForm
from datetime import datetime

from app.s3_helpers import (get_unique_filename, upload_file_to_s3, remove_file_from_s3, download_file_from_s3)

message_routes = Blueprint('messages', __name__)


def message_not_found():
    return {
            "message": "Message could not be found",
            "status_code": 404
        }, 404

def forbidden():
    return {
            "message": "Forbidden",
            "status_code": 403
        }, 403

@message_routes.route('/<message_id>', methods=["PUT"])
@login_required
def edit_message(message_id):
    req = request.get_json()
    message = db.session.query(Message).get(message_id)
    this_user = current_user.to_dict()
    current_timestamp = datetime.utcnow()
    # print(message)
    # print(message.user_id)
    # print(current_user.to_dict())

    if not message:
        return message_not_found()

    if this_user['id'] != message.user_id:
        return forbidden()

    # form = MessageForm()
    # form['csrf_token'].data = request.cookies['csrf_token']
    new_content = req["content"]
    new_pinned = req["is_pinned"]

    if new_content:
        message.content = new_content
    if new_pinned:
        message.is_pinned = new_pinned

    message.updated_at = current_timestamp
    db.session.commit()

    return message.to_dict()

@message_routes.route('/<message_id>', methods=["DELETE"])
@login_required
def delete_message(message_id):
    message = db.session.query(Message).get(message_id)
    this_user = current_user.to_dict()

    if not message:
        return message_not_found()

    if this_user['id'] != message.user_id:
        return forbidden()

    
    message_attachments = message.attachments
    for attachment in message_attachments:

        remove_attachment = remove_file_from_s3(attachment.content)
        if not remove_attachment:
            return {'errors': ['Failed to delete files from AWS']}, 400
        
    
    db.session.delete(message)
    db.session.commit()
    return {
        "message": "Successfully deleted",
        "status_code": 200
    }, 200

# REACTIONS
@message_routes.route("/<int:message_id>/reactions", methods=["POST"])
@login_required
def create_reaction_for_message(message_id):
    # We should check to ensure the conversation is accessible to the user making the request
    # I.e. -- the channel is not private, or the user is a member of that private channel

    # will have to get form
    # form["csrf_token"].data = request.cookies["csrf_token"]
    try:
        # new_reaction = Reaction(**request.get_json())
        req = request.get_json()
        message = db.session.query(Message).get(message_id)

        if not message:
            return message_not_found()

        curr_reactions = db.session.query(Reaction).filter(Reaction.message_id == message_id).all()
        for reaction in curr_reactions:
            if reaction.user_id == current_user.id and reaction.reaction == req["reaction"]:
                return {"errors": "user already has reacted with this reaction"}, 403

        new_reaction = Reaction(user=current_user, messages=message, reaction = req['reaction'])
        db.session.add(new_reaction)
        db.session.commit()
        return new_reaction.to_dict()
    except:
        return { "message": "Failed to post reaction" }, 400

@message_routes.route("/<int:message_id>/reactions", methods=["GET"])
@login_required
def get_reactions_for_message(message_id):

    try:
        reactions = db.session.query(Reaction).filter(Reaction.message_id == message_id).all()
        reactions_data = {"Reactions" :[]}
        for reaction in reactions:
            reaction_data = reaction.to_dict()
            reaction_data['User'] = {
                'username': reaction.user.username
            }
            reactions_data["Reactions"].append(reaction_data)

        return reactions_data
    except:
        return { "message": "Failed to get reactions" }, 400
    

# ATTACHMENTS
@message_routes.route("/attachments/<content_name>", methods=["GET"])
@login_required
def download_attachment(content_name):
    try:
        aws_url = download_file_from_s3(content_name)
        return {"url": aws_url}, 200
    except:
        return {"errors": "Failed to get aws url"}, 400



@message_routes.route("/attachments/<int:attachments_id>", methods=["DELETE"])
@login_required
def delete_attachment_for_messages(attachments_id):
    try: 
        this_attachment = Attachment.query.get(attachments_id)

        if not this_attachment:
            return {'errors': ['Resource not found']}, 404
        if current_user.id != this_attachment.user_id:
            return {'errors': ['Unauthorized']}, 403
        
        remove_attachment = remove_file_from_s3(this_attachment.content)

        if not remove_attachment:
            return {'errors': ['Failed to delete files from AWS']}, 400
        
        db.session.delete(this_attachment)
        db.session.commit()
        return {'message': 'successfully deleted'}, 200
    except:
        return {'errors': 'Failed to delete attachment'}, 400
    
