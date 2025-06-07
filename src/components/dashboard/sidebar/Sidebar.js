import { Offcanvas, Nav, Button, Navbar, Image } from 'react-bootstrap';
import icon from '../../../image/icon.ico';
import './sidebar.css';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../../Context/SidebarContext';
import { ClockHistory, GraphUp, Highlights, House, Lightning, Plus, Wallet, Wallet2 } from 'react-bootstrap-icons';

export default function Sidebar({ handleClose }) {
    const { isSidebarOpen } = useSidebar();
    return (
        <div
            className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
            style={{
                width: isSidebarOpen ? '280px' : '0',
                transition: 'width 0.3s ease',
                backgroundColor: '#1D1E22',
                overflow: `${!isSidebarOpen ? "hidden" : ""}`
            }}
        >
            <div
                className="bg-primary-dark text-light d-flex flex-column"
                style={{ height: "90vh" }}
            >
                <div className="d-flex" style={{ justifyContent: "space-between" }}>
                    <Navbar.Brand as={NavLink} to="/" className="">
                        <Image
                            src={icon}
                            height="100"
                            alt="شعار المنصة"
                        />
                    </Navbar.Brand>
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

                        >
                             <House
                            size={30}
                            color="#97B152"
                            className="me-0"
                            style={{ cursor: 'pointer', margin:"0px 20px 0px "}}
                        />
                            الصفحة الرئيسية
                            
                        </Nav.Link>

                         <Nav.Link
                            as={NavLink}
                            to="/investment"
                            className="sidebar-link"
                            style={{
                                color: '#D4D4DC',
                                padding: '12px 20px',
                                margin: '4px 0',
                                borderRadius: '4px'
                            }}

                        >
                            <Lightning
                            size={30}
                            color="#97B152"
                            className="me-0"
                            style={{ cursor: 'pointer', margin:"0px 20px 0px "}}
                        />
                            فرص استثمارية
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

                        >
                            <GraphUp
                            size={30}
                            color="#97B152"
                            className="me-0"
                            style={{ cursor: 'pointer', margin:"0px 20px 0px "}}
                        />
                            سجل الأستثمار
                        </Nav.Link>

                      <Nav.Link
                            as={NavLink}
                            to="/FactoryRegistration"
                            className="sidebar-link"
                            style={{
                                color: '#D4D4DC',
                                padding: '12px 20px',
                                margin: '4px 0',
                                borderRadius: '4px'
                            }}

                        >
                            <Plus
                            size={30}
                            color="#97B152"
                            className="me-0"
                            style={{ cursor: 'pointer', margin:"0px 20px 0px "}}
                        />
                        اضافة مصنع
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

                        >
                            <ClockHistory
                            size={30}
                            color="#97B152"
                            className="me-0"
                            style={{ cursor: 'pointer', margin:"0px 20px 0px "}}
                        />
                            السجل المالي
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/walet"
                            className="sidebar-link"
                            style={{
                                color: '#D4D4DC',
                                padding: '12px 20px',
                                margin: '4px 0',
                                borderRadius: '4px'
                            }}

                        >
                            <Wallet2
                            size={30}
                            color="#97B152"
                            className="me-0"
                            style={{ cursor: 'pointer', margin:"0px 20px 0px "}}
                        />
                            المحفة الالكترونية
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
            </div>
        </div>
    );
};