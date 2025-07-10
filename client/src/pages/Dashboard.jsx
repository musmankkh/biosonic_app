import { Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";

const Dashboard = () => {
  return (
    <div className="container-fluid">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="bg-white border-end vh-100 p-0">
          <SideNav />
        </Col>

        <Col md={10} className="p-4 bg-light min-vh-100">
          <Outlet />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
