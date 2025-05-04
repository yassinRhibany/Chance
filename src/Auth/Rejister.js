import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function SignUpFormCustom() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const primaryDark = '#1D1E22';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('تم تقديم النموذج:', { username, email, password, confirmPassword });
  };

  return (
    <Container className="mt-5 text-end" dir="rtl" style={{ backgroundColor: primaryDark, color: lightText, padding: '20px', borderRadius: '12px'  }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4" style={{ color: accent }}>إنشاء حساب</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label style={{ color: lightText }}>اسم المستخدم</Form.Label>
              <Form.Control
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ backgroundColor: '#333', color: lightText, borderColor: '#555' }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{ color: lightText }}>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ backgroundColor: '#333', color: lightText, borderColor: '#555' }}
              />
              <Form.Text className="text-muted text-start" style={{ color: '#aaa ' }}>
                لن نشارك بريدك الإلكتروني مع أي شخص آخر.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label style={{ color: lightText }}>كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ backgroundColor: '#333', color: lightText, borderColor: '#555' }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label style={{ color: lightText }}>تأكيد كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ backgroundColor: '#333', color: lightText, borderColor: '#555' }}
              />
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