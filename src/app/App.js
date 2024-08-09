import { fabric } from 'fabric';
import React, { Component } from 'react';
import { Tab, TabList, Tabs } from 'react-web-tabs';
import { Button, Col, Container, Modal, ModalBody, ModalFooter, Row } from "reactstrap";

import FabricCanvas from './components/FabricCanvas';
import Footer from './components/Footer';
import LeftPanel from './components/LeftPanel';
import Toolbar from './components/Toolbar';

import './App.scss';
import './styles/FabricCanvas.scss';
import './styles/Footer.scss';
import './styles/LeftSidePanel.scss';
import './styles/Navbar.scss';
import './styles/TabView.scss';
import './styles/Toolbar.scss';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canvas: null,
            isSnap: false,
            isOverlap: false,
            isGrid: false,
            sidebarWidth: 367,
            canvaswidth: 780,
            canvasheight: 440,
            fontBoldValue: 'normal',
            fontItalicValue: '',
            fontUnderlineValue: '',
            collapse: true,
            gridsize: 30,
            showPreview: false,
            showModal: false,
            previewImageUrl: '', // Add this to store the preview image URL
        };
    }

    updateCanvas = (canvas) => {
        this.setState({
            canvas: canvas
        });
    }

    updateState = (stateoptions) => {
        this.setState(stateoptions);
    }
    toggleSidebar = (type) => {
        const newSidebarWidth = type ? 367 : 0;
        const newCanvasWidth = window.innerWidth - newSidebarWidth - 20; // adjust for padding/margins

        this.setState({
            collapse: type,
            sidebarWidth: newSidebarWidth,
            canvaswidth: newCanvasWidth
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const { collapse } = this.state;
        const sidebarWidth = collapse ? 367 : 0;
        const canvaswidth = window.innerWidth - sidebarWidth - 20; // adjust for padding/margins

        this.setState({ canvaswidth });
    }

    exportCanvas = () => {
        let currentTime = new Date();
        let month = currentTime.getMonth() + 1;
        let day = currentTime.getDate();
        let year = currentTime.getFullYear();
        let hours = currentTime.getHours();
        let minutes = currentTime.getMinutes();
        let seconds = currentTime.getSeconds();
        let fileName = month + '' + day + '' + year + '' + hours + '' + minutes + '' + seconds;
        const canvasdata = document.getElementById('main-canvas');
        const canvasDataUrl = canvasdata.toDataURL().replace(/^data:image\/[^;]*/, 'data:application/octet-stream'),
            link = document.createElement('a');
        fileName = fileName + ".png";
        link.setAttribute('href', canvasDataUrl);
        link.setAttribute('crossOrigin', 'anonymous');
        link.setAttribute('target', '_blank');
        link.setAttribute('download', fileName);
        if (document.createEvent) {
            let evtObj = document.createEvent('MouseEvents');
            evtObj.initEvent('click', true, true);
            link.dispatchEvent(evtObj);
        } else if (link.click) {
            link.click();
        }
    }

    previewCanvas = () => {
        const canvasdata = document.getElementById('main-canvas');
        if (!canvasdata) {
            console.error('Main canvas element not found');
            return;
        }

        const canvasDataUrl = canvasdata.toDataURL();
        this.setState({ showPreview: true, previewImageUrl: canvasDataUrl });
    }

    toggleModal = (tabType = '') => {
        this.setState({ showModal: !this.state.showModal, tabType });
    }

    handleImageUrlChange = (event) => {
        this.setState({ imageUrl: event.target.value });
    }

    addImageToCanvas = () => {
        const { imageUrl, canvas } = this.state;

        if (imageUrl) {
            fabric.Image.fromURL(imageUrl, (img) => {
                canvas.add(img);
                canvas.renderAll();
            });

            this.setState({ showModal: false, imageUrl: '' });
        }
    }

    togglePreview = () => {
        this.setState({ showPreview: !this.state.showPreview });
    }

    render() {
        const { sidebarWidth, collapse, showPreview, showModal, imageUrl, previewImageUrl } = this.state;

        return (
            <Container fluid>
                <Row className="navbar-container">
                    <Col>
                        <nav className="navbar navbar-expand-lg header-bar">
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="{null}bs-example-navbar-collapse-1">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <a className="navbar-brand" ><img src={require('./images/logo.svg')} alt="" /> <small>Web Builder</small></a>
                        </nav>
                    </Col>
                    <Col>
                        <nav className="navbar navbar-expand-lg header-bar">
                            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul className="navbar-nav ml-md-auto">
                                    <li className="nav-item active download">
                                        <span className="btn btn-primary" onClick={this.previewCanvas}>Preview</span>
                                    </li>
                                    <li className="nav-item active download">
                                        <span className="btn btn-success" onClick={this.exportCanvas}>Export</span>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </Col>
                </Row>

                <Row className="main-container">
                    <div className="tabpanel">
                        <Tabs defaultTab="vertical-tab-one" vertical className="vertical-tabs">
                            <TabList>
                                <Tab tabFor="vertical-tab-one" className="lasttab" onClick={() => this.toggleSidebar(true)}>
                                    <div className="edit-box">
                                        <i className="fas fa-font fa-2x text-muted"></i>
                                        <span>TEXT</span>
                                    </div>
                                </Tab>
                                <Tab tabFor="vertical-tab-two" className="lasttab" onClick={() => this.toggleSidebar(true)}>
                                    <div className="edit-box">
                                        <i className="fas fa-border-all fa-2x text-muted"></i>
                                        <span>BKGROUND</span>
                                    </div>
                                </Tab>
                                <Tab tabFor="vertical-tab-three" className="lasttab" onClick={() => this.toggleModal('PHOTOS')}>
                                    <div className="edit-box">
                                        <i className="fas fa-images fa-2x text-muted"></i>
                                        <span>PHOTOS</span>
                                    </div>
                                </Tab>
                                <Tab tabFor="vertical-tab-four" className="lasttab" onClick={() => this.toggleModal('ELEMENTS')}>
                                    <div className="edit-box">
                                        <i className="fas fa-shapes fa-2x text-muted"></i>
                                        <span>ELEMENTS</span>
                                    </div>
                                </Tab>

                            </TabList>
                            <div style={{ width: sidebarWidth }} className="left-side-panel">
                                {collapse && (
                                    <LeftPanel canvas={this.state.canvas} />
                                )}
                            </div>
                            <div className="btn-toggle"
                                onClick={() => this.toggleSidebar(!this.state.collapse)}
                                style={{ opacity: collapse ? 1 : 0 }}>
                                <i className="fas fa-chevron-left arrowimage"></i>
                            </div>
                        </Tabs>
                    </div>

                    <div className="canvas-panel">
                        <Toolbar state={this.state} updateCanvas={this.updateCanvas} />

                        <FabricCanvas state={this.state} updateCanvas={this.updateCanvas} updateState={this.updateState} />

                        <Footer canvas={this.state.canvas}>
                        </Footer>
                    </div>
                </Row>
                <Modal isOpen={showPreview} toggle={this.togglePreview} size="lg">
                    <ModalBody>
                        <div className="preview-container">
                            <img src={previewImageUrl} alt="Canvas Preview" style={{ width: '100%', height: 'auto' }} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="secondary" onClick={this.togglePreview}>Close</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }

}

export default App;
