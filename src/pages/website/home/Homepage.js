import { useState } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { ArrowRight, BarChart, ShieldCheck, Users } from 'react-bootstrap-icons';
import investement from '../../../image/investment.png'
import './Home.css'
export default function HomePage() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="home-page" style={{ backgroundColor: '#1D1E22', color: '#D4D4DC' }}>
            {/* القسم الأول: Hero Section */}
            <section className="hero-section py-5" style={{
                background: 'linear-gradient(135deg, #1D1E22 0%, #2A2C33 100%)',
                borderBottom: '1px solid #393F4D'
            }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-5 mb-lg-0">
                            <h1 className="display-4 fw-bold mb-4" style={{ color: '#FEDA6A' }}>
                                استثمر بذكاء <br /> وانطلق نحو <span className="text-gradient">النجاح</span>
                            </h1>
                            <p className="lead mb-4" style={{ fontSize: '1.25rem' }}>
                                منصة رائدة تصل المستثمرين بأفضل الفرص الصناعية الموثوقة
                            </p>
                            <div className="d-flex gap-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    style={{
                                        backgroundColor: '#FEDA6A',
                                        borderColor: '#FEDA6A',
                                        color: '#1D1E22',
                                        fontWeight: '600'
                                    }}
                                >
                                    ابدأ الاستثمار الآن <ArrowRight className="ms-2" />
                                </Button>
                                <Button
                                    variant="outline-light"
                                    size="lg"
                                >
                                    تعرف أكثر
                                </Button>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="hero-image-container">
                                <img
                                    src={investement}
                                    alt="استثمار صناعي"
                                    className="img-fluid rounded-3 shadow-lg"
                                    // style={{ border: '2px solid #FEDA6A' }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* القسم الثاني: إحصائيات */}
            <section className="stats-section py-5">
                <Container>
                    <Row className="g-4">
                        {[
                            { icon: <BarChart size={40} />, value: '75+', label: 'فرصة استثمارية' },
                            // { icon: <Users size={40} />, value: '1,200+', label: 'مستثمر نشط' },
                            { icon: <ShieldCheck size={40} />, value: '95%', label: 'مشاريع ناجحة' }
                        ].map((stat, index) => (
                            <Col md={4} key={index}>
                                <div className="stat-card p-4 rounded-3 text-center"
                                    style={{
                                        backgroundColor: '#393F4D',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                >
                                    <div
                                        className="mb-3"
                                        style={{
                                            color: activeIndex === index ? '#FEDA6A' : '#D4D4DC',
                                            transition: 'color 0.3s ease'
                                        }}
                                    >
                                        {stat.icon}
                                    </div>
                                    <h2 className="fw-bold" style={{ color: '#FEDA6A' }}>{stat.value}</h2>
                                    <p className="mb-0">{stat.label}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* القسم الثالث: الفرص المميزة */}
            <section className="featured-opportunities py-5">
                <Container>
                    <h2 className="text-center mb-5" style={{ color: '#FEDA6A' }}>
                        <span className="border-bottom border-2 border-accent pb-2">فرص استثمارية مميزة</span>
                    </h2>

                    <Carousel indicators={false} variant="dark">
                        {[1, 2, 3].map((item) => (
                            <Carousel.Item key={item}>
                                <div className="opportunity-card p-4 rounded-4"
                                    style={{
                                        backgroundColor: '#393F4D',
                                        minHeight: '300px'
                                    }}
                                >
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="badge bg-accent text-dark">جديد</span>
                                        <span className="text-success">عائد متوقع: 15%</span>
                                    </div>
                                    <h3>مصنع مواد بناء متكامل</h3>
                                    <p className="text-muted">الرياض، السعودية</p>
                                    <div className="progress mb-3" style={{ height: '10px' }}>
                                        <div
                                            className="progress-bar bg-accent"
                                            role="progressbar"
                                            style={{ width: `${Math.min(item * 30, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <small>تم جمع: {item * 30}%</small>
                                        <Button variant="outline-accent" size="sm">
                                            التفاصيل
                                        </Button>
                                    </div>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Container>
            </section>
        </div>
    );
};
