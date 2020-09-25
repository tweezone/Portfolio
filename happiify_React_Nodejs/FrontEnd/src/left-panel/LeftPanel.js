import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import LANGUAGE from '../service/Language-data';

class LeftPanel extends Component {
    handleLogOutClick = () => {
        this.props.logOutClick();
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.LeftPanel.cn;
        else lang=LANGUAGE.LeftPanel.en;
        
        const { permissions } =this.props;
        return(
            <aside id="left-panel" className="left-panel">
                <nav className="navbar navbar-expand-sm navbar-light">
                    <div className="navbar-header">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fa fa-bars"></i>
                        </button>
                        <a className="navbar-brand" href="0" onClick={(e)=>e.preventDefault()}><img src="images/logo.png" alt="Logo"/></a>
                        <a className="navbar-brand hidden" href="0" onClick={(e)=>e.preventDefault()}><img src="images/logo2.png" alt="Logo"/></a>
                    </div>
                    <div id="main-menu" className="main-menu collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            {
                                false ?//permissions[0][0].value?
                                    <li><Link to="/home"> <i className="menu-icon fas fa-tachometer-alt"></i>{lang[0]}</Link></li> : null
                            }
                            <h3 className="menu-title">{lang[1]}</h3>
                            {
                                permissions[1][0].value?
                                <li className="menu-item-has-children dropdown">
                                    <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fas fa-file-alt"></i>{lang[2]}</a>
                                    <ul className="sub-menu children dropdown-menu">
                                        {permissions[1][1].value?<li><i className="fa fa-list-ol"></i><Link to="/documents">{lang[3]}</Link></li>:null}
                                        {permissions[1][2].value?<li><i className="icon fa fa-plus-square"></i><Link to="/documents/add">{lang[4]}</Link></li>:null}
                                        {permissions[1][5].value?<li><i className="icon fas fa-comment-dots"></i><Link to="/documents/comments">{lang[5]}</Link></li>:null}
                                        {permissions[1][6].value?<li><i className="fa fa-sitemap"></i><Link to="/documents/categories">{lang[6]}</Link></li>:null}
                                    </ul>
                                </li> : null
                            }
                            {
                                permissions[2][0].value?
                                <li className="menu-item-has-children dropdown">
                                    <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fas fa-video"></i>{lang[7]}</a>
                                    <ul className="sub-menu children dropdown-menu">
                                        {permissions[2][1].value?<li><i className="fa fa-list-ol"></i><Link to="/videos">{lang[8]}</Link></li>:null}
                                        {permissions[2][2].value?<li><i className="fa fa-plus-square"></i><Link to="/videos/add">{lang[9]}</Link></li>:null}
                                        {permissions[2][5].value?<li><i className="fas fa-comment-dots"></i><Link to="/videos/comments">{lang[10]}</Link></li>:null}
                                        {permissions[2][6].value?<li><i className="fa fa-sitemap"></i><Link to="/videos/categories">{lang[11]}</Link></li>:null}
                                    </ul>
                                </li>: null
                            }
                            {
                                permissions[3][0].value?
                                <li className="menu-item-has-children dropdown">
                                    <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fas fa-hiking" style={{size: '10x'}}></i>{lang[12]}</a>
                                    <ul className="sub-menu children dropdown-menu">
                                        {permissions[3][1].value?<li><i className="fa fa-list-ol"></i><Link to="/events">{lang[13]}</Link></li>:null}
                                        {permissions[3][2].value?<li><i className="fa fa-plus-square"></i><Link to="/events/add">{lang[14]}</Link></li>:null}
                                        {permissions[3][5].value?<li><i className="fas fa-comment-dots"></i><Link to="/events/comments">{lang[15]}</Link></li>:null}
                                        {permissions[3][6].value?<li><i className="fa fa-sitemap"></i><Link to="/events/categories">{lang[16]}</Link></li>:null}
                                    </ul>
                                </li>: null
                            }
                            {
                                permissions[4][0].value?
                                <li className="menu-item-has-children dropdown">
                                    <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon  fas fa-book-reader"></i>{lang[17]}</a>
                                    <ul className="sub-menu children dropdown-menu">
                                        {permissions[4][1].value?<li><i className="fa fa-list-ol"></i><Link to="/lessons">{lang[18]}</Link></li>:null}
                                        {permissions[4][2].value?<li><i className="fa fa-plus-square"></i><Link to="/lessons/add">{lang[19]}</Link></li>:null}
                                        {permissions[4][5].value?<li><i className="fas fa-comment-dots"></i><Link to="/lessons/comments">{lang[20]}</Link></li>:null}
                                        {permissions[4][6].value?<li><i className="fa fa-sitemap"></i><Link to="/lessons/categories">{lang[21]}</Link></li>:null}
                                    </ul>
                                </li>: null
                            }
                            {
                                permissions[5][0].value?
                                <li className="menu-item-has-children dropdown">
                                    <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="menu-icon fas fa-question-circle"></i>{lang[22]}</a>
                                    <ul className="sub-menu children dropdown-menu">
                                        {permissions[5][1].value?<li><i className="fa fa-list-ol"></i><Link to="/questions">{lang[23]}</Link></li>:null}
                                        {permissions[5][3].value?<li><i className="fa fa-plus-square"></i><Link to="/questions/add">{lang[24]}</Link></li>:null}
                                        {permissions[5][6].value?<li><i className="fa fa-sitemap"></i><Link to="/questions/categories">{lang[25]}</Link></li>:null}
                                    </ul>
                                </li>: null
                            }
                            {
                                permissions[8][0].value?
                                <li className="menu-item-has-children dropdown">
                                    <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i className="menu-icon fas fa-cart-arrow-down"></i>{lang[26]}</a>
                                    <ul className="sub-menu children dropdown-menu">
                                        {permissions[8][1].value?<li><i className="fa fa-list-ol"></i><Link to="/products">{lang[27]}</Link></li>:null}
                                        {permissions[8][5].value?<li><i className="fa fa-sitemap"></i><Link to="/products/categories">{lang[28]}</Link></li>:null}
                                        {permissions[8][6].value?<li><i className="fas fa-cogs"></i><Link to="/products/attributes">{lang[29]}</Link></li>:null}
                                        {permissions[8][7].value?<li><i className="fas fa-object-ungroup"></i><Link to="/products/attribute_groups">{lang[30]}</Link></li>:null}
                                    </ul>
                                </li>: null
                            }
                            {
                                permissions[6][0].value?
                                <li className="menu-item-has-children dropdown">
                                    <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i className="menu-icon fas fa-briefcase-medical"></i>{lang[31]}</a>
                                    <ul className="sub-menu children dropdown-menu">
                                        {permissions[6][1].value?<li><i className="fa fa-list-ol"></i><Link to="/health/doctors">{lang[32]}</Link></li>:null}
                                        {permissions[6][5].value?<li><i className="fa fa-sitemap"></i><Link to="/health/doctors/categories">{lang[33]}</Link></li>:null}
                                    </ul>
                                </li>: null
                            }
                            {
                                permissions[9][0].value?
                                <li className="menu-item-has-children dropdown">
                                    <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i className="menu-icon fas fa-compass"></i>{lang[34]}</a>
                                    <ul className="sub-menu children dropdown-menu">
                                        {permissions[9][1].value?<li><i className="fas fa-globe-americas"></i><Link to="/location/countries">{lang[35]}</Link></li>:null}
                                        {permissions[9][3].value?<li><i className="fas fa-map-marked-alt"></i><Link to="/location/provinces">{lang[36]}</Link></li>:null}
                                        {permissions[9][7].value?<li><i className="fas fa-city"></i><Link to="/location/cities">{lang[37]}</Link></li>:null}
                                    </ul>
                                </li>: null
                            }
                            {
                                permissions[7][0].value?
                                <li className="menu-item-has-children dropdown">
                                    <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i className="menu-icon fas fa-users"></i>{lang[38]}</a>
                                    <ul className="sub-menu children dropdown-menu">
                                        {permissions[7][1].value?<li><i className="fa fa-list-ol"></i><Link to="/users">{lang[39]}</Link></li>:null}
                                        {permissions[7][2].value?<li><i className="fa fa-plus-square"></i><Link to="/users/add">{lang[40]}</Link></li>:null}
                                        {permissions[7][6].value?<li><i className="fas fa-object-ungroup"></i><Link to="/users/roles">{lang[41]}</Link></li>:null}
                                        {permissions[7][7].value?<li><i className="fas fa-lock"></i><Link to="/users/permissions">{lang[42]}</Link></li>:null}
                                        {/*permissions[7][8].value*/ false?<li><i className="fas fa-file-alt"></i><Link to="/users/activity">{lang[43]}</Link></li>:null}
                                    </ul>
                                </li>: null
                            }
                            

                            {/*<h3 className="menu-title">Icons</h3>
                            <li>
                                <a href="widgets.html"> <i className="menu-icon ti-email"></i>Widgets </a>
                            </li>
                            <li className="menu-item-has-children dropdown">
                                <a href="0" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i className="menu-icon fas fa-chart-line"></i>Charts</a>
                                <ul className="sub-menu children dropdown-menu">
                                    <li><i className="menu-icon fa fa-line-chart"></i><a href="charts-chartjs.html">Chart JS</a></li>
                                    <li><i className="menu-icon fa fa-area-chart"></i><a href="charts-flot.html">Flot Chart</a></li>
                                    <li><i className="menu-icon fa fa-pie-chart"></i><a href="charts-peity.html">Peity Chart</a></li>
                                </ul>
                            </li>

                            <li className="menu-item-has-children dropdown">
                                <a href="0" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="menu-icon fas fa-map-marked-alt"></i>Maps</a>
                                <ul className="sub-menu children dropdown-menu">
                                    <li> <i className="menu-icon fas fa-map-signs"></i><a href="maps-gmap.html">Google Maps</a></li>
                                    <li><i className="menu-icon fa fa-street-view"></i><a href="maps-vector.html">Vector Maps</a></li>
                                </ul>
                            </li>*/}

                            <h3 className="menu-title">{lang[44]}</h3>
                            <li className="menu-item-has-children dropdown">
                                <a href="0" onClick={(e)=>e.preventDefault()} className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="menu-icon fas fa-window-maximize"></i>{lang[45]}</a>
                                <ul className="sub-menu children dropdown-menu">
                                    <li><i className="menu-icon fas fa-sign-in-alt"></i><Link to="/login">{lang[46]}</Link></li>
                                    <li><i className="menu-icon fas fa-sign-out-alt"></i><Link to="/login" onClick={this.handleLogOutClick}>{lang[47]}</Link></li>
                                </ul>
                            </li>
                            {/* {renderIcon()} */}
                        </ul>
                    </div>
                </nav>
            </aside>
        );
    }
}

export default LeftPanel;

    

// function renderIcon(){
//     console.log("Show me now: " + window.location.href.substr(window.location.origin.length));

//     var link = window.location.href.substr(window.location.origin.length);
    
    
// }