import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Modal, Input, Row, Col } from "antd";
import toast, { Toaster } from "react-hot-toast";

const TELEGRAM_BOT_TOKEN = "8182871492:AAFbCEUbEU7Xnfp5ObmaHnFBrGau730ZlQo";
const CHAT_ID = "5186161943";

const sendMessage = async (text: any) => {
  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
    }
  );
};

function App() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data));
  }, []);

  const handleOrderClick = (product: any) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = () => {
    const message = `
<b>🛒 Yangi Buyurtma</b>
<b>Mahsulot:</b> ${selectedProduct.title}
<b>Narxi:</b> $${selectedProduct.price}
<b>Ism:</b> ${formData.name}
<b>Telefon:</b> ${formData.phone}
<b>Manzil:</b> ${formData.address}
`;

    sendMessage(message);
    setModalOpen(false);
    setFormData({ name: "", phone: "", address: "" });
    toast.success("order telegramga yuborildi");
  };

  const handleGetInfo = () => {
    sendMessage("🧾 Kimdir 'Get Info' tugmasini bosdi.");
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div style={{ padding: "24px" }}>
        <Button
          type="primary"
          onClick={handleGetInfo}
          style={{ marginBottom: "16px" }}
        >
          Get Info
        </Button>

        <Row gutter={[16, 16]}>
          {products.map((product: any) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                cover={
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ height: 200, objectFit: "contain" }}
                  />
                }
                title={product.title}
                bordered={true}
              >
                <p>
                  <b>Price:</b> ${product.price}
                </p>
                <Button
                  type="primary"
                  onClick={() => handleOrderClick(product)}
                >
                  Order
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          open={modalOpen}
          title="Buyurtma Tafsilotlari"
          onCancel={() => setModalOpen(false)}
          onOk={handleSubmitOrder}
          okText="Order"
        >
          {selectedProduct && (
            <>
              <p>
                <b>Mahsulot:</b> {selectedProduct.title}
              </p>
              <img
                src={selectedProduct.image}
                alt=""
                style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
              />
              <p>
                <b>Narxi:</b> ${selectedProduct.price}
              </p>

              <Input
                name="name"
                value={formData.name}
                onChange={handleInput}
                placeholder="Ismingiz"
                style={{ margin: "8px 0" }}
              />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInput}
                placeholder="Telefon raqam"
                style={{ margin: "8px 0" }}
              />
              <Input
                name="address"
                value={formData.address}
                onChange={handleInput}
                placeholder="Manzil"
              />
            </>
          )}
        </Modal>
      </div>
    </>
  );
}

export default App;
