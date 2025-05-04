import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // هنا يمكنك إضافة منطق معالجة تسجيل الدخول
    console.log('تم تقديم نموذج تسجيل الدخول:', { email, password });
    // يمكنك أيضًا إضافة عمليات التحقق من الصحة هنا
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">تسجيل الدخول</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>البريد الإلكتروني</Form.Label>
              <Form.Control
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              تسجيل الدخول
            </Button>
          </Form>
          <div className="mt-3 text-center">
            ليس لديك حساب؟ <a href="/signup">إنشاء حساب</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;