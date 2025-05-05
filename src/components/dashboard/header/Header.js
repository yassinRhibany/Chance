import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { List, Moon, Sun, Person } from 'react-bootstrap-icons';
import Sidebar from '../sidebar/Sidebar';
import icon from '../../../image/chance.png'
import './header.css'
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
export default function Header (){
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Navbar
                bg="primary-dark"
                variant="dark"
                expand="lg"
                className="py-3 border-bottom border-accent"
            >
                <Container >
                    {/* الجزء الأيسر: الشعار + قائمة الصفحات */}
                    <div className="d-flex align-items-center">
                        {/* زر السايدبار (للأجهزة الصغيرة) */}
                        <Button
                            variant="outline-accent"
                            className="me-3"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            style={{ borderColor: '#DCAE1D' }}
                        >
                            <List color="#DCAE1D" />
                        </Button>

                        {/* الشعار */}
                        <Navbar.Brand href="#home" className="me-5" style={{ paddingLeft: "200px" }}>
                            <Image

                                src={icon}
                                height="40"
                                alt="شعار المنصة"
                            />
                        </Navbar.Brand>

                        {/* قائمة الصفحات (تظهر على الأجهزة الكبيرة فقط) */}
                        <Nav className="d-none d-lg-flex gap-4">
                            <Nav.Link  as={NavLink}  to="./" className="text-light fs-5">الصفحة الرئيسية</Nav.Link>
                            <Nav.Link  as={NavLink}  to='./about' className="text-light fs-5">حول المنصة</Nav.Link>
                            <Nav.Link  as={NavLink}  to="./contact" className="text-light fs-5">اتصل بنا</Nav.Link>
                        </Nav>
                    </div>

                    {/* الجزء الأيمن: عناصر التحكم */}
                    <div className="d-flex align-items-center gap-3">
                        {/* زر الوضع الليلي */}
                        <Button
                            variant="outline-accent"
                            className="rounded-circle p-2"
                            onClick={() => setDarkMode(!darkMode)}
                            style={{
                                borderColor: '#DCAE1D',
                                width: '40px',
                                height: '40px'
                            }}
                        >
                            {darkMode ? <Sun color="#DCAE1D" /> : <Moon color="#DCAE1D" />}
                        </Button>

                        {/* زر التسجيل */}
                        <Button 
                            variant="primary"
                            className="animated-button"
                            style={{
                                backgroundColor: '#FEDA6A',
                                color: '#1D1E22',
                                border: 'none',
                                boxShadow: '0 0 15px rgba(254, 218, 106, 0.5)'
                            }}
                           
                        >
                            تسجيل الدخول
                        </Button>
                    </div>
                </Container>
            </Navbar>

            <Sidebar
                show={sidebarOpen}
                handleClose={() => setSidebarOpen(false)}
            />
        </>
    );
};

