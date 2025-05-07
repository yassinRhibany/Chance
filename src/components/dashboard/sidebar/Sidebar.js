import { Offcanvas, Nav, Button, Navbar, Image } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import icon from '../../../image/icon.ico';
import './sidebar.css';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ show, handleClose }) {
    return (
        <Offcanvas
            show={show}
            onHide={handleClose}
            placement="end"
            className="bg-primary-dark text-light d-flex flex-column"
            style={{ width: '280px' }}
        >
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
                <Navbar.Brand as={NavLink} to="/" className="">
                    <Image
                        src={icon}
                        height="100"
                        alt="شعار المنصة"
                    />
                </Navbar.Brand>

                <Button
                    variant="link"
                    onClick={handleClose}
                    className="p-0 close-btn"
                    style={{ color: '#FEDA6A' }}
                >
                    <X size={40} />
                </Button>
            </div>

            <Offcanvas.Body className="flex-grow-1"
                style={{
                    background: 'linear-gradient(135deg, #1D1E22 0%, #2A2C33 100%)',
                    boxShadow: 'inset 0 0 30px rgba(254, 218, 106, 0.1)'
                }}
            >
                <Nav className="flex-column gap-3 px-3">
                    <Nav.Link 
                        as={NavLink} 
                        to="/"
                        className="sidebar-link"
                        style={{
                            color: '#D4D4DC',
                            padding: '12px 20px',
                            margin: '4px 0',
                            borderRadius: '4px'
                        }}
                        onClick={handleClose} // إغلاق السايدبار عند النقر
                    >
                        الصفحة الرئيسية
                    </Nav.Link>
                    <Nav.Link 
                        as={NavLink} 
                        to="/investmentrecord"
                        className="sidebar-link"
                        style={{
                            color: '#D4D4DC',
                            padding: '12px 20px',
                            margin: '4px 0',
                            borderRadius: '4px'
                        }}
                        onClick={handleClose} // إغلاق السايدبار عند النقر
                    >
                        سجل الأستثمار
                    </Nav.Link>
                </Nav>
            </Offcanvas.Body>

            <div className="border-top border-accent pt-3 pb-4 px-3">
                <Nav className="flex-column gap-3">
                    <Nav.Link
                        as={NavLink}
                        to="/about"
                        className="text-light fs-5 py-2"
                        onClick={handleClose}
                    >
                        حول المنصة
                    </Nav.Link>
                    <Nav.Link
                        as={NavLink}
                        to="/contact"
                        className="text-light fs-5 py-2"
                        onClick={handleClose}
                    >
                        اتصل بنا
                    </Nav.Link>
                </Nav>
            </div>
        </Offcanvas>
    );
};