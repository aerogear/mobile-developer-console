import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle, Modal, Button } from '@patternfly/react-core';
import {
  OverflowMenu,
  OverflowMenuControl,
  OverflowMenuContent,
  OverflowMenuItem
} from '@patternfly/react-core/dist/esm/experimental';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { deleteApp } from '../actions/apps';
import { deleteBuildConfig } from '../actions/buildConfigs';

class DeleteItemButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isOpen: false
    };

    this.onToggle = isOpen => {
      this.setState({
        isOpen
      });
    };

    this.onSelect = event => {
      this.setState({
        isOpen: !this.state.isOpen
      });
    };

    this.openDialog = () => {
      this.setState({
        showModal: true
      });
    };
  }

  triggerDeletion = history => {
    const { onDelete, navigate } = this.props;
    if (onDelete && typeof onDelete === 'function') {
      onDelete();
    } else {
      const { itemType, itemName } = this.props;
      switch (itemType) {
        case 'app':
          this.props.deleteApp(itemName);
          break;
        case 'buildconfig':
          this.props.deleteBuildConfig(itemName);
          break;
        default:
          break;
      }
    }
    // This ensure hiding the dropdown menu when deletion was not successful
    // See https://github.com/react-bootstrap/react-bootstrap/issues/541
    document.dispatchEvent(new MouseEvent('click'));
    navigate && history.replace(navigate);
    this.handleDialogClose();
  };

  openDialog = () => {
    this.setState({
      showModal: true
    });
  };

  getItemName() {
    return this.props.item ? this.props.item.metadata.name : this.props.itemName;
  }

  render() {
    const { itemType, title = 'Delete' } = this.props;
    const itemName = this.getItemName();
    const { showModal } = this.state;
    const { isOpen } = this.state;
    const dropdownItems = [
      <DropdownItem key="action" onClick={this.openDialog}>
        {title}
      </DropdownItem>
    ];
    return (
      <Route
        render={props => (
          <React.Fragment>
            {title.includes('Android') || title.includes('IOS') ? (
              <OverflowMenu breakpoint="xl">
                <OverflowMenuContent>
                  <OverflowMenuItem>
                    <Button onClick={this.openDialog}>{title}</Button>
                  </OverflowMenuItem>
                </OverflowMenuContent>
                <OverflowMenuControl>
                  <Dropdown
                    onSelect={this.onSelect}
                    position={DropdownPosition.right}
                    toggle={<KebabToggle onToggle={this.onToggle} />}
                    isOpen={isOpen}
                    isPlain
                    dropdownItems={dropdownItems}
                  />
                </OverflowMenuControl>
              </OverflowMenu>
            ) : (
              <Button onClick={this.openDialog}>{title}</Button>
            )}
            <Modal
              width="50%"
              title="Confirm Delete"
              isOpen={showModal}
              onClose={this.handleDialogClose}
              actions={[
                <Button key="Delete" variant="danger" onClick={() => this.triggerDeletion(props.history)}>
                  Delete
                </Button>,
                <Button key="Cancel" variant="secondary" onClick={this.handleDialogClose}>
                  Cancel
                </Button>
              ]}
            >
              <p>
                {`Are you sure you want to delete the ${itemType} '`}
                <b>{itemName}</b>
                {`'?`}
              </p>
              <p>
                {itemName} and its data will no longer be available. <b>It cannot be undone.</b> Make sure this is
                something you really want to do!
              </p>
            </Modal>
          </React.Fragment>
        )}
      />
    );
  }
}

const mapDispatchToProps = {
  deleteApp,
  deleteBuildConfig
};

export default connect(
  null,
  mapDispatchToProps
)(DeleteItemButton);
