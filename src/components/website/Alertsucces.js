import { Toast } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";

export default function Alertsucces (p){  
    return(
           <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: '100%',
        maxWidth: '600px'
      }}>
        <Toast
          show={p.showSuccessToast}
          // onClose={() => setShowSuccessToast(false)}
          delay={5000}
          autohide
          style={{
            backgroundColor: '#198754', // أخضر success
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
          <Toast.Body style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <CheckCircleFill style={{
                fontSize: '2.5rem',
                color: 'white'
              }} />
              <div>
                <h4 style={{
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }}>تمت العملية بنجاح!</h4>
                <p style={{
                  marginBottom: '0',
                  fontSize: '1.2rem'
                }}>
                  تم استثمار مبلغ <strong>{p.investmentAmount} ريال</strong> في العقار
                </p>
              </div>
            </div>
          </Toast.Body>
        </Toast>
      </div>
    )
}