import React from "react";
import Identicon from "react-identicons";
import { Navbar, Container } from "react-bootstrap";

const NavBar = ({ loginName }) => {
	return (
		<React.Fragment>
			<Navbar bg="light" expand="sm" sticky="top">
				<Container fluid>
					<Navbar.Brand>
						<Identicon string={loginName} size={50} />
					</Navbar.Brand>
					<Navbar.Collapse className="justify-content-start">
						<Navbar.Text bsPrefix="h4">Group Name OG</Navbar.Text>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</React.Fragment>
	);
};

export default NavBar;
