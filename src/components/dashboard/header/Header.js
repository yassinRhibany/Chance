import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Image } from 'react-bootstrap';
import { List, Moon, Sun, Person, X, BoxArrowRight } from 'react-bootstrap-icons';
import icon from '../../../image/chance.png'
import './header.css'
import { NavLink, useNavigate } from 'react-router-dom';
import ProfileIcon from '../../ProfileIcon/ProfileIcon';
import { useSidebar } from '../../../Context/SidebarContext';
import { useAuth } from '../../../Context/AuthContext';
import Message from '../../Message.js/Message';
export default function Header() {
    const { isSidebarOpen, toggleSidebar, setIsSidebarOpen } = useSidebar();
    const { user, setUser } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [coler, setcoler] = useState('');
    const Navigate = useNavigate();

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [user])

    function logout() {
        setUser(null);
        setSuccessMessage("تم تسجيل الخروج بنجاح")
        setcoler("#198754")
        setShowSuccess(true)
        // توجيه المستخدم بعد 3 ثواني
        setTimeout(() => {
            Navigate('/login');
        },0);

    }
    return (
        <>


            <Navbar
                bg="primary-dark"
                variant="dark"
                expand="lg"
                className="border-bottom border-accent"
                style={{
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    padding: '0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000
                }}
            >

                {/* رسالة  */}
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    width: '100%',
                    maxWidth: '600px',
                    padding: '0 15px'
                }}>
                    <Message
                        coler={coler}
                        show={showSuccess}
                        message={successMessage}
                        onClose={() => setShowSuccess(false)}
                    />
                </div>


                <Container >
                    {/* الجزء الأيسر: الشعار + قائمة الصفحات */}
                    <div className="d-flex align-items-center">
                        {/* زر السايدبار (للأجهزة الصغيرة) */}
                        {user && <Button
                            onClick={toggleSidebar}
                            variant="outline-accent"
                            className="m-3"
                            style={{
                                borderColor: '#FEDA6A',
                                color: '#FEDA6A'
                            }}
                        >
                            {isSidebarOpen ? <X size={20} /> : <List size={20} />}
                        </Button>
                        }


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
                            <Nav.Link as={NavLink} to="./" className="text-light fs-5">الصفحة الرئيسية</Nav.Link>
                            <Nav.Link as={NavLink} to='./about' className="text-light fs-5">حول المنصة</Nav.Link>
                            <Nav.Link as={NavLink} to="./contact" className="text-light fs-5">اتصل بنا</Nav.Link>
                        </Nav>
                    </div>

                    {/* الجزء الأيمن: عناصر التحكم */}
                    <div className="d-flex align-items-center gap-3">

                        {user &&
                            <Nav.Link as={NavLink} to="./CompleteUserProfile" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <ProfileIcon isProfileComplete={true} />
                            </Nav.Link>
                        }

                        {!user ? (
                            /* زر التسجيل */
                            <Nav.Link as={NavLink} to="./login"
                                variant="primary"
                                className="animated-button"
                                style={{
                                    backgroundColor: '#FEDA6A',
                                    color: '#1D1E22',
                                    border: 'none',
                                    boxShadow: '0 0 15px rgba(254, 218, 106, 0.5)',
                                    padding: '6px 12px',
                                    borderRadius: '5px'
                                }}

                            >
                                تسجيل الدخول
                            </Nav.Link>
                        ) : (
                            /* زر الخروج */
                            <Button

                                className="animated-button"
                                onClick={logout}
                                style={{
                                    backgroundColor: '#FEDA6A',
                                    color: '#1D1E22',
                                    border: 'none',
                                    boxShadow: '0 0 15px rgba(254, 218, 106, 0.5)',
                                    padding: '6px 12px',
                                    borderRadius: '5px'
                                }}

                            >
                                <BoxArrowRight className="me-2" style={{ paddingLeft: "5px", fontSize: "25px", color: "red" }} />
                                الخروج
                            </Button>
                        )}

                    </div>
                </Container>
            </Navbar>


        </>
    );
};

