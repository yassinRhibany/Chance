import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { baseURL, LOGIN } from '../Api/Api';
import axios from 'axios';

function LoginFormCustom() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const primaryDark = '#393F4D';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';

  function handleChange(e) {
    setForm({...form, [e.target.name]: e.target.value});
    console.log(form);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}/${LOGIN}`, form);
      console.log("تم تسجيل الدخول بنجاح");
      console.log(form);
    } catch(err) {
      console.error('خطأ في تسجيل الدخول:', err);
    }
  }

  return (
    <Container className="mt-5 text-end" dir="rtl" style={{ 
      backgroundColor: primaryDark, 
      color: lightText, 
      padding: '20px', 
      borderRadius: '12px',
      maxWidth: '600px'
    }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4" style={{ color: accent }}>تسجيل الدخول</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{ color: lightText }}>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="أدخل البريد الإلكتروني"
                value={form.email}
                onChange={handleChange}
                required
                style={{ 
                  backgroundColor: '#ffff', 
                  // color: lightText, 
                  borderColor: '#555' 
                }}
              />
              
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label style={{ color: lightText }}>كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="أدخل كلمة المرور"
                value={form.password}
                onChange={handleChange}
                required
                style={{ 
                  backgroundColor: '#ffff', 
                  // color: lightText, 
                  borderColor: '#555' 
                }}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              style={{ 
                backgroundColor: accent, 
                borderColor: accent, 
                color: primaryDark,
                marginBottom: '15px'
              }}
            >
              تسجيل الدخول
            </Button>

            <div className="text-center" style={{ color: lightText }}>
              <a href="/forgot-password" style={{ color: accent }}>
                نسيت كلمة المرور؟
              </a>
            </div>
          </Form>

          <div className="mt-4 text-center" style={{ color: lightText }}>
            ليس لديك حساب؟{' '}
            <a href="/register" style={{ color: accent }}>
              إنشاء حساب جديد
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginFormCustom;