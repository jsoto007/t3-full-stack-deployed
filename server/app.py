import os

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify, request, make_response, render_template, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from sqlalchemy.exc import IntegrityError

from config import db, bcrypt, app
from models import User, CarInventory, CarPhoto, MasterCarRecord, UserInventory

# Add this block
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True
}


from flask_cors import CORS
CORS(app)


migrate = Migrate(app, db)

@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

api = Api(app)


class Signup(Resource):
    def post(self):
        json = request.get_json()
        user = User(
            email = json['username']
        )
        try:
            user.password_hash = json['password']
            db.session.add(user)
            db.session.commit()
            return user.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {"error": "Username already exists."}, 422


class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            user = User.query.filter(User.id == session['user_id']).first()
            return user.to_dict(), 200
        return {"error": "Please log in"}, 401


class Login(Resource):
    def post(self):
        email = request.get_json()['username']
        password = request.get_json()['password']

        user = User.query.filter(User.email == email).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id
            return user.to_dict(), 200
        return {'error': "401 Unauthorized"}, 401


class Logout(Resource):
    def delete(self):
        session['user_id'] = None

        return {}, 204


class CarInventories(Resource):
    def get(self):
        cars = [car.to_dict() for car in CarInventory.query.all()]
        return make_response(jsonify(cars), 200)

    def post(self):
        data = request.get_json()
        user_inventory_id = data.get('user_inventory_id')
        if user_inventory_id:
            inventory = UserInventory.query.filter_by(id=user_inventory_id).first()
            if not inventory:
                return {"error": "User inventory not found"}, 404
            if inventory.submitted:
                return {"error": "Inventory has been submitted and cannot be modified"}, 403
        else:
            return {"error": "User inventory ID is required"}, 400

        new_car = CarInventory(
            location=data['location'],
            vin_number=data['vin_number'],
            year=data.get('year'),
            make=data.get('make'),
            user_id=data['user_id'],
            user_inventory_id=user_inventory_id
        )
        db.session.add(new_car)
        db.session.commit()
        return make_response(new_car.to_dict(), 201)


# UserInventories resource to handle creating and submitting user inventories
class UserInventories(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return {"error": "User ID is required"}, 400

        new_inventory = UserInventory(user_id=user_id)
        db.session.add(new_inventory)
        db.session.commit()
        return make_response(new_inventory.to_dict(), 201)

    def patch(self, id):
        inventory = UserInventory.query.filter_by(id=id).first()
        if not inventory:
            return {"error": "Inventory not found"}, 404

        inventory.submitted = True
        db.session.commit()
        return make_response(inventory.to_dict(), 200)


class UserInventoryHistory(Resource):
    def get(self, user_id):
        inventories = UserInventory.query.filter_by(user_id=user_id).order_by(UserInventory.created_at.desc()).limit(12).all()
        return make_response(jsonify([inv.to_dict() for inv in inventories]), 200)


class CarPhotos(Resource):
    def post(self):
        data = request.get_json()
        new_photo = CarPhoto(
            url=data['url'],
            car_inventory_id=data['car_inventory_id']
        )
        db.session.add(new_photo)
        db.session.commit()
        return make_response(new_photo.to_dict(), 201)


class MasterCarRecords(Resource):
    def get(self):
        records = [rec.to_dict() for rec in MasterCarRecord.query.order_by(MasterCarRecord.created_at.desc()).all()]
        return make_response(jsonify(records), 200)

    def post(self):
        data = request.get_json()
        new_record = MasterCarRecord(
            vin_number=data['vin_number'],
            location=data.get('location'),
            year=data.get('year'),
            make=data.get('make'),
            purchase_price=data.get('purchase_price'),
            selling_price=data.get('selling_price'),
            sold_price=data.get('sold_price'),
            is_sold=data.get('is_sold', False)
        )
        db.session.add(new_record)
        db.session.commit()
        return make_response(new_record.to_dict(), 201)


class MasterCarRecordById(Resource):
    def get(self, id):
        record = MasterCarRecord.query.filter_by(id=id).first()
        if not record:
            return {"error": "Record not found"}, 404
        return make_response(record.to_dict(), 200)

    def patch(self, id):
        record = MasterCarRecord.query.filter_by(id=id).first()
        if not record:
            return {"error": "Record not found"}, 404

        data = request.get_json()
        for attr, value in data.items():
            setattr(record, attr, value)

        db.session.commit()
        return make_response(record.to_dict(), 200)

    def delete(self, id):
        record = MasterCarRecord.query.filter_by(id=id).first()
        if not record:
            return {"error": "Record not found"}, 404

        db.session.delete(record)
        db.session.commit()
        return make_response('', 204)


# AdminUserInventoryCheck resource: returns the specified user inventory and matching cars
class AdminUserInventoryCheck(Resource):
    def get(self, user_inventory_id):
        # Check if the session user is admin
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401

        user = User.query.filter_by(id=user_id).first()
        if not user or not getattr(user, 'admin', False):
            return {"error": "Forbidden: Admins only"}, 403

        # Get the user inventory
        user_inventory = UserInventory.query.filter_by(id=user_inventory_id).first()
        if not user_inventory:
            return {"error": "User inventory not found"}, 404

        # Get all master car records with created_at <= user_inventory.created_at
        cars = MasterCarRecord.query.filter(
            MasterCarRecord.created_at <= user_inventory.created_at
        ).all()

        return make_response(jsonify({
            "user_inventory": user_inventory.to_dict(),
            "matching_cars": [car.to_dict() for car in cars]
        }), 200)

api.add_resource(Signup, '/api/signup', endpoint='signup')
api.add_resource(CheckSession, '/api/check_session', endpoint='check_session')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')

api.add_resource(CarInventories, '/api/cars', endpoint='cars')
api.add_resource(CarPhotos, '/api/car_photos', endpoint='car_photos')
api.add_resource(MasterCarRecords, '/api/master_inventory', endpoint='master_inventory')
api.add_resource(MasterCarRecordById, '/api/master_inventory/<int:id>', endpoint='master_inventory_by_id')


api.add_resource(UserInventories, '/api/user_inventories', endpoint='user_inventories')
api.add_resource(UserInventories, '/api/user_inventories/<int:id>', endpoint='user_inventory_submit')

api.add_resource(UserInventoryHistory, '/api/user_inventories/history/<int:user_id>', endpoint='user_inventory_history')

# Admin endpoint to check a specific user inventory and its cars
api.add_resource(AdminUserInventoryCheck, '/api/admin/user_inventory_check/<int:user_inventory_id>', endpoint='admin_user_inventory_check')

# Serve Vite build in production
from flask import send_from_directory
import os

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    dist_dir = os.path.join(os.path.dirname(__file__), "../client/dist")
    if path != "" and os.path.exists(os.path.join(dist_dir, path)):
        return send_from_directory(dist_dir, path)
    else:
        return send_from_directory(dist_dir, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
