import React, { useState } from "react";
import { Container, Card, Table, Badge, Form } from "react-bootstrap";
import { FaArrowUp, FaArrowDown, FaChartLine, FaCoins, FaHandHoldingUsd } from "react-icons/fa";

const UserTransactions = () => {
  // أنواع المعاملات المحددة (5 أنواع الآن)
  const transactionTypes = {
    DEPOSIT: "إيداع",
    WITHDRAWAL: "سحب",
    INVESTMENT_BUY: "شراء حصص",
    INVESTMENT_SELL: "بيع حصص",
    DIVIDEND: "عوائد مالية"
  };

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: transactionTypes.DEPOSIT,
      amount: 10000,
      date: "2023-11-01 09:15",
      status: "مكتمل",
      balance: 15000
    },
    {
      id: 2,
      type: transactionTypes.INVESTMENT_BUY,
      amount: -5000,
      date: "2023-10-28 14:30",
      status: "مكتمل",
      balance: 10000
    },
    {
      id: 3,
      type: transactionTypes.DIVIDEND,
      amount: 1200,
      date: "2023-10-25 11:00",
      status: "مكتمل",
      balance: 11200
    },
    {
      id: 4,
      type: transactionTypes.INVESTMENT_SELL,
      amount: 3500,
      date: "2023-10-20 10:45",
      status: "مكتمل",
      balance: 14700
    },
    {
      id: 5,
      type: transactionTypes.WITHDRAWAL,
      amount: -2000,
      date: "2023-10-15 16:20",
      status: "معلق",
      balance: 12700
    }
  ]);

  const [filterType, setFilterType] = useState("الكل");

  const filteredTransactions = filterType === "الكل" 
    ? transactions 
    : transactions.filter(tx => tx.type === filterType);

  // إرجاع أيقونة ولون حسب نوع المعاملة
  const getTransactionDetails = (type) => {
    switch(type) {
      case transactionTypes.DEPOSIT:
        return { icon: <FaArrowUp className="me-2" />, color: "success" };
      case transactionTypes.WITHDRAWAL:
        return { icon: <FaArrowDown className="me-2" />, color: "danger" };
      case transactionTypes.INVESTMENT_BUY:
        return { icon: <FaHandHoldingUsd className="me-2" />, color: "info" };
      case transactionTypes.INVESTMENT_SELL:
        return { icon: <FaChartLine className="me-2" />, color: "primary" };
      case transactionTypes.DIVIDEND:
        return { icon: <FaCoins className="me-2" />, color: "warning" };
      default:
        return { icon: null, color: "secondary" };
    }
  };

  return (
    <Container fluid className="py-4">
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
            {Object.values(transactionTypes).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Select>
        </Card.Header>
        
        <Card.Body>
          <Table hover className="table-dark align-middle">
            <thead>
              <tr>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>الرصيد</th>
                <th>التاريخ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const { icon, color } = getTransactionDetails(tx.type);
                return (
                  <tr key={tx.id}>
                    <td>
                      <span className={`text-${color}`}>
                        {icon}
                        {tx.type}
                      </span>
                    </td>
                    <td className={tx.amount > 0 ? "text-success" : "text-danger"}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} ر.س
                    </td>
                    <td>{tx.balance.toLocaleString()} ر.س</td>
                    <td>{tx.date}</td>
                    <td>
                      <Badge bg={
                        tx.status === "مكتمل" ? "success" : 
                        tx.status === "معلق" ? "warning" : 
                        "danger"
                      }>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>

        <Card.Footer className="bg-secondary-dark text-muted">
          <div className="d-flex justify-content-between">
            <small>إجمالي المعاملات المعروضة: {filteredTransactions.length}</small>
            <small>آخر تحديث: {new Date().toLocaleString('ar-SA')}</small>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default UserTransactions;