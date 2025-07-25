import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Badge, Form, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTag, FaUpload, FaTrash, FaArrowLeft, FaChartLine, FaCoins, FaMoneyBillWave, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../../Context/AuthContext';

const FactoryDetails = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const { item } = state;
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [opportunities, setOpportunities] = useState([]);
    const [loadingOpportunities, setLoadingOpportunities] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0); // مفتاح للتحديث
    // تنسيق الصور
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const [intervalId, setIntervalId] = useState(null);
    // جلب الفرص الاستثمارية
    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                setLoadingOpportunities(true);
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/InvestmentOpprtunities/getFactoryOpportunities/${item.id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                            'Accept': 'application/json'
                        }
                    }
                );

                if (response.data && response.data.opportunities) {
                    setOpportunities(response.data.opportunities);
                } else {
                    setOpportunities([]);
                }
            } catch (err) {
                console.error('Error fetching opportunities:', err);
                setError(`خطأ في جلب البيانات: ${err.message}`);
            } finally {
                setLoadingOpportunities(false);
            }
        };

        if (item?.id && user?.token) fetchOpportunities();
    }, [item.id, user?.token, refreshKey]); // أضف refreshKey كمتابع

    // جلب الصور عند تحميل الصفحة أو عند التحديث
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/images/getFactoryImages/${item.id}`,
                    {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    }
                );
                setImages(response.data.images || []);
            } catch (err) {
                console.error('Error fetching images:', err);
            }
        };

        if (item?.id && user?.token) fetchImages();
    }, [item.id, user?.token, refreshKey]); // أضف refreshKey كمتابع

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const validFiles = files.filter(file => allowedTypes.includes(file.type));

        if (validFiles.length !== files.length) {
            setError('بعض الملفات ليست صوراً مدعومة (JPEG, PNG, GIF فقط)');
        }

        setSelectedFiles(validFiles);
    };

    const handleUpload = async () => {
        if (!selectedFiles.length) {
            setError('الرجاء اختيار صورة واحدة على الأقل');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('image', selectedFiles[0]);

            const response = await axios.post(
                `http://127.0.0.1:8000/api/images/uploadFactoryImage/${item.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                setSuccess('تم رفع الصورة بنجاح');
                setSelectedFiles([]);
                setRefreshKey(prev => prev + 1); // تحديث الصفحة
            }
        } catch (err) {
            let errorMessage = 'فشل في رفع الصورة';
            if (err.response) {
                if (err.response.status === 422) {
                    errorMessage = 'بيانات غير صالحة: ';
                    if (err.response.data.errors) {
                        errorMessage += Object.values(err.response.data.errors).flat().join(', ');
                    }
                } else {
                    errorMessage = err.response.data.message || errorMessage;
                }
            }
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/images/deleteFactoryImage/${imageId}`,
                {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }
            );
            setSuccess('تم حذف الصورة بنجاح');
            setRefreshKey(prev => prev + 1); // تحديث الصفحة
        } catch (err) {
            setError('فشل في حذف الصورة');
            console.error('Delete Error:', err);
        }
    };

    // الدوال المساعدة الأخرى تبقى كما هي
    const getStatusBadge = (status) => {
        const statusMap = {
            'approved': 'success',
            'reject': 'danger',
            'pending': 'warning',
            '1': 'success',
            '0': 'warning',
            'مكتمل': 'primary'
        };
        return statusMap[status] || 'secondary';
    };

    const IsActive = (state) => {
        return state == 1 ? 'نشط' : 'غير نشط';
    }

    const calculateProgress = (collected, target) => {
        if (!collected || !target) return 0;
        const collectedNum = parseFloat(collected);
        const targetNum = parseFloat(target);
        return Math.min(Math.round((collectedNum / targetNum) * 100), 100);
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0.00';
        return parseFloat(amount).toLocaleString('ar-EG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // وظائف تنسيق عرض الصور

    // دالة للصورة التالية
    const nextImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [images.length]);

    // دالة للصورة السابقة
    const prevImage = useCallback(() => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }, [images.length]);

    // بدء التشغيل التلقائي
    useEffect(() => {
        if (autoPlay && images.length > 1) {
            const id = setInterval(() => {
                nextImage();
            }, 3000); // تغيير الصورة كل 3 ثواني
            setIntervalId(id);

            return () => clearInterval(id);
        }
    }, [autoPlay, images.length, nextImage]);

    // إيقاف التشغيل التلقائي عند التفاعل
    const handleUserInteraction = () => {
        setAutoPlay(false);
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }

        // استئناف التشغيل التلقائي بعد 10 ثواني من عدم التفاعل
        setTimeout(() => {
            setAutoPlay(true);
        }, 10000);
    };
    return (
        <div className="factory-details-page dark-theme" style={{
            backgroundColor: '#121212',
            minHeight: '100vh',
            padding: '20px 0',
            color: '#f8f9fa'
        }}>
            <Container>
                <Button
                    variant="outline-light"
                    onClick={() => navigate(-1)}
                    className="mb-4"
                    style={{ borderColor: 'var(--accent)' }}
                >
                    <FaArrowLeft className="me-2" /> رجوع
                </Button>

                {error && (
                    <Alert variant="danger" className="mb-4" onClose={() => setError('')} dismissible>
                        <FaExclamationTriangle className="me-2" />
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert variant="success" className="mb-4" onClose={() => setSuccess('')} dismissible>
                        {success}
                    </Alert>
                )}

                <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#1e1e1e' }}>
                    <div className="factory-gallery" style={{
                        height: '400px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {images.length > 0 ? (
                            <>
                                <div style={{
                                    display: 'flex',
                                    height: '100%',
                                    width: '100%',
                                    position: 'relative'
                                }}>
                                    {images.map((img, index) => (
                                        <div
                                            key={img.id}
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                transition: 'opacity 0.5s ease',
                                                opacity: index === currentImageIndex ? 1 : 0,
                                                zIndex: index === currentImageIndex ? 1 : 0
                                            }}
                                        >
                                            <img
                                                src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                                                alt={`صورة المصنع ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    backgroundColor: '#000'
                                                }}
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    left: '10px',
                                                    zIndex: 2
                                                }}
                                                onClick={() => handleDeleteImage(img.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* أسهم التنقل */}
                                {images.length > 1 && (
                                    <>
                                        <Button
                                            variant="outline-light"
                                            style={{
                                                position: 'absolute',
                                                left: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                zIndex: 2,
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onClick={prevImage}
                                        >
                                            <FaArrowLeft />
                                        </Button>
                                        <Button
                                            variant="outline-light"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                zIndex: 2,
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onClick={nextImage}
                                        >
                                            <FaArrowRight />
                                        </Button>
                                    </>
                                )}

                                {/* نقاط التوجيه */}
                                {images.length > 1 && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        zIndex: 2,
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        {images.map((_, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    backgroundColor: index === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setCurrentImageIndex(index)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center h-100 bg-dark">
                                <div className="text-center text-light">
                                    <FaBuilding size={48} className="mb-3" />
                                    <p>لا توجد صور متاحة لهذا المصنع</p>
                                </div>
                            </div>
                        )}
                    </div>


                    <Card.Body>
                        <div className="mb-4 p-3 border rounded" style={{ backgroundColor: '#121212', borderColor: '#333' }}>
                            <h5 className="text-light mb-3">إضافة صور جديدة للمصنع</h5>
                            <Form.Group controlId="formImages" className="mb-3">
                                <Form.Control
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    accept="image/jpeg, image/png, image/gif"
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                onClick={handleUpload}
                                disabled={uploading || !selectedFiles.length}
                            >
                                {uploading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" /> جاري الرفع...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload className="me-2" /> رفع الصور
                                    </>
                                )}
                            </Button>
                            {selectedFiles.length > 0 && (
                                <div className="mt-2 text-light">
                                    <small>تم اختيار {selectedFiles.length} صورة</small>
                                </div>
                            )}
                        </div>

                        <div className="factory-info">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="text-light mb-0">{item.name}</h2>
                                <Badge bg={getStatusBadge(item.status)} className="fs-6">
                                    {item.status}
                                </Badge>
                            </div>

                            <Row className="g-3">
                                <Col md={6}>
                                    <div className="info-item p-3 rounded" style={{ backgroundColor: '#121212' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <FaMapMarkerAlt className="me-2 text-primary" />
                                            <h6 className="mb-0 text-light">العنوان</h6>
                                        </div>
                                        <p className="mb-0 text-light">{item.address}</p>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="info-item p-3 rounded" style={{ backgroundColor: '#121212' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <FaTag className="me-2 text-primary" />
                                            <h6 className="mb-0 text-light">التصنيف</h6>
                                        </div>
                                        <p className="mb-0 text-light">{item.category}</p>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="info-item p-3 rounded" style={{ backgroundColor: '#121212' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <FaUser className="me-2 text-primary" />
                                            <h6 className="mb-0 text-light">مالك المصنع</h6>
                                        </div>
                                        <p className="mb-0 text-light">{item.user_id}</p>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="info-item p-3 rounded" style={{ backgroundColor: '#121212' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <FaCalendarAlt className="me-2 text-primary" />
                                            <h6 className="mb-0 text-light">تاريخ التسجيل</h6>
                                        </div>
                                        <p className="mb-0 text-light">{item.registeredDate}</p>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mt-4">
                                <Col>
                                    <Card className="border-0" style={{ backgroundColor: '#121212' }}>
                                        <Card.Body>
                                            <h5 className="text-light mb-3">معلومات إضافية</h5>
                                            <Row>
                                                <Col md={4} className="mb-3">
                                                    <div className="text-light">حالة النشاط:</div>
                                                    <div className="fw-bold text-light">

                                                        <Badge bg={getStatusBadge(item.is_active)} className="fs-6">
                                                            {IsActive(item.is_active)}
                                                        </Badge>


                                                    </div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <div className="text-light">تاريخ الإنشاء:</div>
                                                    <div className="fw-bold text-light">{item.created_at}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <div className="text-light">آخر تحديث:</div>
                                                    <div className="fw-bold text-light">{item.updated_at}</div>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: '#1e1e1e' }}>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-light mb-0">
                                <FaChartLine className="me-2 text-primary" />
                                الفرص الاستثمارية
                            </h4>
                        </div>

                        {loadingOpportunities ? (
                            <div className="text-center py-4">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : opportunities.length > 0 ? (
                            opportunities.map((opportunity, index) => (
                                <Card key={index} className="mb-3 border-0" style={{ backgroundColor: '#121212' }}>
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col md={8}>
                                                <h5 className="text-light">
                                                    <FaCoins className="me-2 text-warning" />
                                                    فرصة استثمارية #{opportunity.id}
                                                </h5>
                                                <div className="mb-3">
                                                    <ProgressBar
                                                        now={calculateProgress(opportunity.collected_amount, opportunity.target_amount)}
                                                        label={`${calculateProgress(opportunity.collected_amount, opportunity.target_amount).toFixed(2)}%`}
                                                        variant="success"
                                                        animated
                                                        style={{ height: '25px' }}
                                                    />
                                                </div>
                                                <Row className="text-light small">
                                                    <Col md={4}>
                                                        <div className="mb-1">
                                                            <FaMoneyBillWave className="me-2" />
                                                            <strong>المبلغ المستهدف:</strong> {formatCurrency(opportunity.target_amount)} $
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="mb-1">
                                                            <FaMoneyBillWave className="me-2" />
                                                            <strong>المبلغ المجموع:</strong> {formatCurrency(opportunity.collected_amount)} $
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="mb-1">
                                                            <FaMoneyBillWave className="me-2" />
                                                            <strong>الحد الأدنى:</strong> {formatCurrency(opportunity.minimum_target)} $
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md={4} className="text-end">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => navigate('/opportunity/details', { state: { opportunity } })}
                                                >
                                                    التفاصيل
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row className="mt-2 text-light small">
                                            <Col md={4}>
                                                <div className="mb-1">
                                                    <strong>تاريخ البدء:</strong> {opportunity.strtup}
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="mb-1">
                                                    <strong>تكرار الدفع:</strong> {opportunity.payout_frequency === 'monthly' ? 'شهري' :
                                                        opportunity.payout_frequency === 'quarterly' ? 'ربع سنوي' : 'سنوي'}
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="mb-1">
                                                    <strong>نسبة الربح:</strong> {opportunity.profit_percentage}%
                                                </div>
                                            </Col>
                                        </Row>
                                        {opportunity.descrption && (
                                            <div className="mt-2 p-2 bg-dark rounded text-light">
                                                <strong>الوصف:</strong> {opportunity.descrption}
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-4 text-light">
                                <FaChartLine size={48} className="mb-3 text-muted" />
                                <h5>لا توجد فرص استثمارية متاحة لهذا المصنع</h5>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default FactoryDetails;