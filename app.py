from flask import Flask, redirect, render_template, url_for, request, current_app, flash
import datetime, json, os, psycopg2
from whitenoise import WhiteNoise
from decouple import config



app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app, root="static/")
app.secret_key = config('SECRET_KEY')


def get_db_connection():
    conn = psycopg2.connect(
        host=config('DB_HOST'),
        database=config('DB_NAME'),
        user=config('DB_USER'),
        password=config('DB_PASSWORD'),
        port=config('DB_PORT')
    )
    return conn






@app.route('/')
def home():
    return render_template('home.html')


@app.route('/portal')
def portal():
    
    return render_template('portal.html')


@app.route('/portalHandler', methods=['POST'])
def portalHandler():
    if request.method == 'POST':
        name= ''
        firstname = request.form.get('firstname') or None
        middlename = request.form.get('middlename') or None
        lastname = request.form.get('lastname') or None
        email = request.form.get('email') or None
        dob = request.form.get('dob') or None
        gender = request.form.get('gender') or None
        phone = request.form.get('phone') or None
        address = request.form.get('address') or None
        state = request.form.get('state') or None
        lga = request.form.get('lga') or None
        kin = request.form.get('kin') or None
        jamb = request.form.get('jamb') or None
        image = request.files.get('image') or None

        if firstname and middlename and lastname and email and dob and gender and phone and address and state and lga and jamb and image:
            name = firstname + '_' + lastname + '_' + image.filename
            filepath = os.path.join(current_app.root_path, 'static/images/' + name)
            image.save(filepath)
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute('insert into students(firstname, middlename, lastname, email, dob, gender, phone, address, state, lga, kin, jamb, img_path) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (firstname, middlename, lastname, email, dob, gender, phone, address, state, lga, kin, jamb, name))
            conn.commit()
            cur.close()
        else:
            flash('Please fill all fields', 'flash_error')
            return redirect(url_for('portal'))
        flash('Successfully added student')
        return redirect(url_for('index'))
    return redirect(url_for('portal'))
    
            





@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        students = ''
        name = request.form.get('searchName') or None
        status = request.form.get('searchStatus') or None
        gender = request.form.get('searchGender') or None
        jamb = request.form.get('searchJamb') or None

        if name or status or gender or jamb:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute('select * from students where firstname like %s or firstname is null or middlename like %s or middlename is null or lastname like %s or lastname is null or status like %s or status is null or gender like %s or gender is null or jamb like %s or jamb is null', (name, name, name, status, gender, jamb))
            rv = cur.fetchall()
            students = rv
        else:
            flash('Please add a search term', 'flash_success')
            return redirect(url_for('index'))
        flash('Search completed', 'flash_success')
        return render_template('index.html', students = students)
    return redirect(url_for('index'))


@app.route('/index')
def index():

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('select * from students')
    rv = cur.fetchall()
    students = rv

    return render_template('index.html', students = students)


@app.route('/detail', methods=['GET', 'POST'])
def detail():
    student = ''
    details = request.form['id']
    if request.method == 'POST':
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('select * from students where student_id=%s', (details, ))
        rv = cur.fetchall()
        student = rv

    return render_template('detail.html', student = student)



@app.route('/changeStatus', methods=['POST'])
def changeStatus():
    req = request.get_json()
    status = req['studentStatus']
    id = req['id']

    if request.method == 'POST':
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('update students set status=%s where student_id=%s', (status, id))
        conn.commit()
        cur.close()

        flash('Status Changed Successfully', 'flash_success')
        return json.dumps(status)

    return json.dumps('success')




if __name__ == '__main__':
    app.run(debug = True)