import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';

import Paneset from '../Paneset';
import Pane from '../Pane';
import PaneMenu from '../PaneMenu';
import Button from '../Button';
import NavList from '../NavList';
import NavListSection from '../NavListSection';

class EntrySelector extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    addButtonTitle: PropTypes.string,
    detailComponent: PropTypes.func.isRequired,
    detailPaneTitle: PropTypes.string,
    editable: PropTypes.bool,
    paneWidth: PropTypes.string,
    paneTitle: PropTypes.string,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    parentMutator: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    contentData: PropTypes.arrayOf(
      PropTypes.object,
    ).isRequired,

    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    editable: true,
  };

  constructor(props) {
    super(props);

    this.activeLink = this.activeLink.bind(this);
    this.linkPath = this.linkPath.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  linkPath(id) {
    return `${this.props.match.path}/${id}`;
  }

  activeLink(links) {
    return this.props.location.pathname || this.linkPath(links[0].key);
  }

  onClose() {
    this.props.history.push(`${this.props.match.path}`);
  }

  renderDetail(item) {
    const { detailPaneTitle, paneWidth, detailComponent, parentMutator, editable } = this.props;
    const ComponentToRender = detailComponent;

    const lastMenu = (
      <Button id="clickable-edit-item" onClick={() => this.props.onEdit(item)} title="Edit" buttonStyle="primary">
        Edit
      </Button>
    );

    return (
      <Pane
        paneTitle={detailPaneTitle}
        {...editable ? { lastMenu } : {}}
        defaultWidth={paneWidth}
        dismissible
        onClose={this.onClose}
      >
        <ComponentToRender initialValues={item} parentMutator={parentMutator} />
      </Pane>
    );
  }

  render() {
    const { addButtonTitle, contentData, paneTitle } = this.props;
    const links = _.sortBy(contentData, ['name']).map(item => (
      <Link key={item.id} to={this.linkPath(item.id)}>{item.name || '[unnamed]'}</Link>
    ));

    const routes = contentData.map(item => (
      <Route
        key={item.id}
        path={this.linkPath(item.id)}
        render={() => this.renderDetail(item)}
      />
    ));

    const LastMenu = (
      <PaneMenu>
        <Button title={addButtonTitle} onClick={this.props.onAdd} buttonStyle="primary paneHeaderNewButton">
          + New
        </Button>
      </PaneMenu>
    );

    return (
      <Paneset>
        <Pane defaultWidth="fill" lastMenu={LastMenu} paneTitle={paneTitle} noOverflow>
          <NavList>
            <NavListSection activeLink={this.activeLink(links)}>
              {links}
            </NavListSection>
          </NavList>
        </Pane>

        <Switch>
          {routes}
        </Switch>

        {this.props.children}
      </Paneset>
    );
  }
}

export default EntrySelector;
