import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      const token = await login(email, password);
      localStorage.setItem('token', token);
      navigate('/albaran');
    } catch (err) {
      setError(t('Error de inicio de sesión, verifica tus credenciales'));
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <div className="text-center mb-4">
            <h2>{t('Iniciar sesión')}</h2>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form>
            <Form.Group controlId="email">
              <Form.Label>{t('Correo electrónico')}</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>{t('Contraseña')}</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" className="w-100 mt-3" onClick={handleLogin}>
              {t('Iniciar sesión')}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
