import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Form, Spinner, Alert, Button, Modal } from "react-bootstrap";
import { FaArrowUp, FaArrowDown, FaChartLine, FaCoins, FaHandHoldingUsd, FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../../Context/AuthContext";

const UserTransactions = () => {
  const { user } = useAuth();
  const token = user?.token || null;

  // أنواع المعاملات المحددة
  const transactionTypes = {
    buy: "شراء حصص",
    sell: "بيع حصص",
    deposit: "إيداع",
    withdrawal: "سحب",
    dividend: "عوائد مالية"
  };

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("الكل");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // جلب بيانات المعاملات من API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error("لا يوجد توكن دخول");
      }

      const response = await axios.get(
        "http://127.0.0.1:8000/api/Transaction/getUserTransactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setTransactions(response.data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.response?.data?.message || err.message || "حدث خطأ في جلب بيانات المعاملات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token]);

  const filteredTransactions = filterType === "الكل"
    ? transactions
    : transactions.filter(tx => tx.type === filterType);

  // إرجاع أيقونة ولون حسب نوع المعاملة
  const getTransactionDetails = (type) => {
    switch (type) {
      case "deposit":
        return { icon: <FaArrowUp className="me-2" />, color: "success", text: transactionTypes.deposit };
      case "withdrawal":
        return { icon: <FaArrowDown className="me-2" />, color: "danger", text: transactionTypes.withdrawal };
      case "buy":
        return { icon: <FaHandHoldingUsd className="me-2" />, color: "info", text: transactionTypes.buy };
      case "sell":
        return { icon: <FaChartLine className="me-2" />, color: "primary", text: transactionTypes.sell };
      case "dividend":
        return { icon: <FaCoins className="me-2" />, color: "warning", text: transactionTypes.dividend };
      default:
        return { icon: null, color: "secondary", text: type };
    }
  };

  // تنسيق التاريخ

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };


  // Format numbers in English format
  const formatNumber = (number) => {
    return parseFloat(number).toLocaleString("en-US");
  };


  // عرض تفاصيل المعاملة
  const showTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  if (loading && transactions.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error}
          <button className="btn btn-link text-white" onClick={fetchTransactions}>
            إعادة المحاولة
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="border-accent">
        <Card.Header className="bg-secondary-dark d-flex justify-content-between align-items-center">
          <h5 className="text-accent mb-0">
            <FaCoins className="me-2" />
            سجل المعاملات المالية
          </h5>
          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: "200px" }}
            className="bg-primary-dark text-light"
          >
            <option value="الكل">جميع المعاملات</option>
            {Object.entries(transactionTypes).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </Form.Select>
        </Card.Header>

        <Card.Body>
          {loading && transactions.length > 0 && (
            <div className="text-center mb-3">
              <Spinner animation="border" size="sm" />
            </div>
          )}

          {filteredTransactions.length > 0 ? (
            <Table hover className="table-dark align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>النوع</th>
                  <th>المبلغ</th>
                  <th>رقم الفرصة</th>
                  <th>تاريخ العملية</th>
                  <th>التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => {
                  const { icon, color, text } = getTransactionDetails(tx.type);
                  const amount = parseFloat(tx.amount);
                  return (
                    <tr key={tx.id}>
                      <td>{index + 1}</td>
                      <td>
                        <Badge bg={color}>
                          {icon}
                          {text}
                        </Badge>
                      </td>
                      <td className={amount > 0 ? "text-success" : "text-danger"}>
                       {amount > 0 ? "+" : ""}{formatNumber(amount)}$
                      </td>
                      <td>{tx.opprtunty_id}</td>
                      <td>{formatDate(tx.time_operation)}</td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => showTransactionDetails(tx)}
                        >
                          <FaInfoCircle /> عرض التفاصيل
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">
              لا توجد معاملات متاحة
            </Alert>
          )}
        </Card.Body>

        <Card.Footer className="bg-secondary-dark text-muted">
          <div className="d-flex justify-content-between">
            <small>إجمالي المعاملات المعروضة: {filteredTransactions.length}</small>
            <small>آخر تحديث: {new Date().toLocaleString("ar-SA")}</small>
          </div>
        </Card.Footer>
      </Card>

      {/* Modal لعرض التفاصيل الكاملة */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>تفاصيل المعاملة</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          {selectedTransaction && (
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <h6>معلومات أساسية</h6>
                  <hr />
                  <p><strong>رقم المعاملة:</strong> {selectedTransaction.id}</p>
                  <p>
                    <strong>النوع:</strong>
                    <Badge bg={getTransactionDetails(selectedTransaction.type).color} className="me-2">
                      {getTransactionDetails(selectedTransaction.type).text}
                    </Badge>
                  </p>
                  <p>
                    <strong>المبلغ:</strong>
                    <span className={selectedTransaction.amount > 0 ? "text-success" : "text-danger"}>
                     {selectedTransaction.amount > 0 ? "+" : ""}{formatNumber(selectedTransaction.amount)}$
                    </span>
                  </p>
                  <p><strong>رقم الفرصة:</strong> {selectedTransaction.opprtunty_id}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <h6>معلومات إضافية</h6>
                  <hr />
                  <p><strong>رقم المستخدم:</strong> {selectedTransaction.user_id}</p>
                  <p><strong>تاريخ العملية:</strong> {formatDate(selectedTransaction.time_operation)}</p>
                  <p><strong>تاريخ الإنشاء:</strong> {formatDate(selectedTransaction.created_at)}</p>
                  <p><strong>آخر تحديث:</strong> {formatDate(selectedTransaction.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserTransactions;