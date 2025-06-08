import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { baseURL, REGISTER } from '../Api/Api';
import axios from 'axios';

function SignUpFormCustom() {
  const [form, SetForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "investor" // القيمة الافتراضية
  });

  const primaryDark = '#393F4D';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';

  function handelChange(e) {
    SetForm({...form, [e.target.name]: e.target.value});
    console.log(form);
  }

  async function handelSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/${REGISTER}`, form);
      console.log("success");
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <Container className="mt-5 text-end" dir="rtl" style={{ backgroundColor: primaryDark, color: lightText, padding: '20px', borderRadius: '12px' }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4" style={{ color: accent }}>إنشاء حساب</h2>
          <Form onSubmit={handelSubmit}>
            {/* الحقول الأخرى كما هي */}
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label style={{ color: lightText }}>اسم المستخدم</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="أدخل اسم المستخدم"
                value={form.name}
                onChange={handelChange}
                required
                style={{
                   backgroundColor: '#ffff', 
                  //  color: lightText,
                    borderColor: '#555'
                   }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{ color: lightText }}>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="أدخل البريد الإلكتروني"
                value={form.email}
                onChange={handelChange}
                required
                style={{ 
                  backgroundColor: '#ffff', 
                  // color: lightText,
                   borderColor: '#555' 
                  }}
              />
              <Form.Text style={{ color: "red" }}>
                لن نشارك بريدك الإلكتروني مع أي شخص آخر.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label style={{ color: lightText }}>كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="أدخل كلمة المرور"
                value={form.password}
                onChange={handelChange}
                required
                style={{
                   backgroundColor: '#ffff',
                  //  color: lightText, 
                   borderColor: '#555' 
                  }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label style={{ color: lightText }}>تأكيد كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                name="repeatPassword"
                placeholder="أعد إدخال كلمة المرور"
                value={form.repeatPassword}
               
                required
                style={{
                   backgroundColor: '#ffff',
                  //  color: lightText, 
                   borderColor: '#555' 
                  }}
              />
            </Form.Group>

            {/* حقل نوع الحساب في الأسفل */}
            <Form.Group className="mb-4" controlId="formUserType">
              <Form.Label style={{ color: lightText }}>نوع الحساب</Form.Label>
              <Form.Select 
                name="userType"
                value={form.userType}
                onChange={handelChange}
                required
                style={{ backgroundColor: '#ffff', color: lightText, borderColor: '#555' }}
              >
                <option value="investor">مستثمر</option>
                <option value="propertyOwner">صاحب عقار</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: accent, borderColor: accent, color: primaryDark }}>
              إنشاء حساب
            </Button>
          </Form>
          <div className="mt-3 text-center" style={{ color: lightText }}>
            لديك حساب بالفعل؟ <a href="/login" style={{ color: accent }}>تسجيل الدخول</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUpFormCustom;