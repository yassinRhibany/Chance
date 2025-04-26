import React from 'react';
import { Container, Row, Col, Card, Accordion, Image, Button } from 'react-bootstrap';
import { Bullseye, Lightbulb, ShieldCheck, BarChartLine, People, Globe } from 'react-bootstrap-icons';
import idea from '../../../image/idea.png'
import future from '../../../image/future.png'
export default function About () {
  const services = [
    {
      icon: <Bullseye size={40} />,
      title: "رسالتنا",
      description: "ربط المستثمرين بفرص استثمارية صناعية ذات عوائد مضمونة عبر منصة موثوقة."
    },
    {
      icon: <Lightbulb size={40} />,
      title: "رؤيتنا",
      description: "أن نكون المنصة الرائدة في تحفيز الاستثمار الصناعي في المنطقة."
    },
    {
      icon: <ShieldCheck size={40} />,
      title: "أمان",
      description: "نضمن أعلى معايير الأمان والشفافية في كل المعاملات."
    }
  ];

  const features = [
    {
      title: "فرص استثمارية متنوعة",
      content: "طيف واسع من الفرص في مختلف القطاعات الصناعية"
    },
    {
      title: "تقارير مفصلة",
      content: "تحليلات دقيقة لمعدلات العائد والمخاطر"
    },
    {
      title: "إدارة محفظة متكاملة",
      content: "أدوات متقدمة لمتابعة استثماراتك"
    }
  ];

  return (
    <div className="about-page py-5" style={{ backgroundColor: '#1D1E22', color: '#D4D4DC' }}>
      {/* القسم الأول: مقدمة */}
      <section className="intro-section mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#FEDA6A' }}>
                <span className="border-bottom border-3 border-accent pb-2">من نحن</span>
              </h1>
              <p className="lead fs-3 mb-4">
                منصة استثمارية رائدة تهدف إلى تحويل الصناعة المحلية عبر تمكين الاستثمار الذكي
              </p>
              <div className="d-flex align-items-center mb-4">
                <div className="vr me-3 bg-accent" style={{ height: '50px', opacity: 1 }}></div>
                <p className="mb-0 fs-5">
                  تأسست في 2023، نجحت في ربط أكثر من 1200 مستثمر بفرص صناعية واعدة
                </p>
              </div>
              <Button
                variant="outline-accent" 
                size="lg"
                style={{ 
                  borderColor: '#FEDA6A',
                  color: '#FEDA6A'
                }}
              >
                انضم إلينا الآن
              </Button>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <Image 
                  src={idea} 
                  fluid 
                  rounded 
                  className="shadow-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* القسم الثاني: الخدمات */}
      <section className="services-section py-5 mb-5" style={{ backgroundColor: '#393F4D' }}>
        <Container>
          <h2 className="text-center mb-5" style={{ color: '#FEDA6A' }}>
            <span className="border-bottom border-2 border-accent pb-2">خدماتنا</span>
          </h2>
          <Row className="g-4">
            {services.map((service, index) => (
              <Col md={4} key={index}>
                <Card 
                  className="h-100 border-0 shadow-lg" 
                  style={{ backgroundColor: '#1D1E22' }}
                >
                  <Card.Body className="text-center p-4">
                    <div 
                      className="icon-wrapper mb-4 mx-auto"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(254, 218, 106, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {React.cloneElement(service.icon, { color: '#FEDA6A' })}
                    </div>
                    <Card.Title style={{ color: '#FEDA6A' }}>{service.title}</Card.Title>
                    <Card.Text style={{color:"#ffff"}}>{service.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* القسم الثالث: الميزات */}
      <section className="features-section mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <Image 
                src={future} 
                fluid 
                rounded 
                className="shadow-lg"
              />
            </Col>
            <Col lg={6}>
              <h2 className="mb-4" style={{ color: '#FEDA6A' }}>لماذا تختارنا؟</h2>
              <Accordion defaultActiveKey="0" flush>
                {features.map((feature, index) => (
                  <Accordion.Item 
                    key={index} 
                    eventKey={index.toString()}
                    style={{ 
                      backgroundColor: '#393F4D',
                      borderColor: '#FEDA6A'
                    }}
                  >
                    <Accordion.Header>
                      <span style={{ color: '#7CB242' }}>{feature.title}</span>
                    </Accordion.Header>
                    <Accordion.Body style={{ color:"#ffff", backgroundColor: '#7CB242' }}>
                      {feature.content}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* القسم الرابع: فريق العمل */}
      <section className="team-section py-5">
        <Container>
          <h2 className="text-center mb-5" style={{ color: '#FEDA6A' }}>
            <span className="border-bottom border-2 border-accent pb-2">فريق الخبراء</span>
          </h2>
          <Row className="g-4 justify-content-center">
            {[
              { name: "أحمد محمد", role: "المدير التنفيذي", img: "team1.jpg" },
              { name: "سارة علي", role: "رئيسة القطاع المالي", img: "team2.jpg" },
              { name: "خالد عبدالله", role: "خبير الاستثمار", img: "team3.jpg" }
            ].map((member, index) => (
              <Col md={4} lg={3} key={index}>
                <div className="team-card text-center">
                  <div className="position-relative mb-3">
                    <Image 
                      src={`/images/team/${member.img}`} 
                      roundedCircle 
                      width={150}
                      height={150}
                      className="object-fit-cover border border-3 border-accent"
                    />
                    <div className="social-links">
                      {/* مواقع التواصل الاجتماعي */}
                    </div>
                  </div>
                  <h5 className="mb-1" style={{ color: '#FEDA6A' }}>{member.name}</h5>
                  <p className="text-muted">{member.role}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};
