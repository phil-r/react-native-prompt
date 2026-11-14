import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import styles from './styles';

export default class Prompt extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    cancelText: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    borderColor: PropTypes.string,
    promptStyle: PropTypes.object,
    titleStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
    submitButtonStyle: PropTypes.object,
    submitButtonTextStyle: PropTypes.object,
    cancelButtonStyle: PropTypes.object,
    cancelButtonTextStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    textInputProps: PropTypes.object,
    limit: PropTypes.number
  };

  static defaultProps = {
    visible: false,
    defaultValue: '',
    cancelText: 'Cancel',
    submitText: 'OK',
    borderColor: '#ccc',
    promptStyle: {},
    titleStyle: {},
    buttonStyle: {},
    buttonTextStyle: {},
    submitButtonStyle: {},
    submitButtonTextStyle: {},
    cancelButtonStyle: {},
    cancelButtonTextStyle: {},
    inputStyle: {},
    onChangeText: () => {},
    limit: 0
  };

  static getDerivedStateFromProps(props) {
    return { visible: props.visible };
  }

  state = {
    value: '',
    visible: false,
    length: 0
  };

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      const value = this.props.defaultValue || '';
      this.setState({ value, length: value.length });
    }
  }

  componentDidMount() {
    this.setState({
      value: this.props.defaultValue,
      length: this.props.defaultValue ? this.props.defaultValue.length : 0
    });
  }

  _onChangeText = value => {
    const length = value.length;
    this.setState({ value, length });
    this.props.onChangeText(value);
  };

  _onSubmitPress = async () => {
    if (this.submitting) return;
    const { value } = this.state;
    const { limit } = this.props;
    if (limit && value.length > limit) return;
    this.submitting = true;
    try {
      await this.props.onSubmit(value);
    } finally {
      this.submitting = false;
    }
  };

  _onCancelPress = () => {
    if (!this.submitting) this.props.onCancel();
  };

  close = () => {
    this.setState({ visible: false });
  };

  _renderDialog = () => {
    const {
      title,
      placeholder,
      cancelText,
      submitText,
      borderColor,
      promptStyle,
      titleStyle,
      buttonStyle,
      buttonTextStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      cancelButtonStyle,
      cancelButtonTextStyle,
      inputStyle,
      limit
    } = this.props;
    const { length } = this.state;
    const limitReached = !!limit && length > limit;
    return (
      <View style={styles.dialog} key="prompt">
        <View style={styles.dialogOverlay} />
        <View style={[styles.dialogContent, { borderColor }, promptStyle]}>
          <View style={[styles.dialogTitle, { borderColor }]}>
            <Text style={[styles.dialogTitleText, titleStyle]}>{title}</Text>
          </View>
          <View style={styles.dialogBody}>
            <TextInput
              style={[styles.dialogInput, inputStyle]}
              value={this.state.value}
              onChangeText={this._onChangeText}
              onSubmitEditing={this._onSubmitPress}
              placeholder={placeholder}
              autoFocus={true}
              underlineColorAndroid="white"
              {...this.props.textInputProps}
            />
          </View>
          {limit ? (
            <View style={[styles.dialogLimit]}>
              <Text
                style={[
                  styles.dialogLimitText,
                  limitReached && { color: 'red' }
                ]}
              >
                {length} / {limit}
              </Text>
            </View>
          ) : null}
          <View style={[styles.dialogFooter, { borderColor }]}>
            <TouchableWithoutFeedback onPress={this._onCancelPress}>
              <View
                style={[styles.dialogAction, buttonStyle, cancelButtonStyle]}
              >
                <Text
                  style={[
                    styles.dialogActionText,
                    buttonTextStyle,
                    cancelButtonTextStyle
                  ]}
                >
                  {cancelText}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              disabled={limitReached}
              onPress={this._onSubmitPress}
            >
              <View
                style={[styles.dialogAction, buttonStyle, submitButtonStyle]}
              >
                <Text
                  style={[
                    styles.dialogActionText,
                    buttonTextStyle,
                    submitButtonTextStyle,
                    limitReached && { color: 'gray' }
                  ]}
                >
                  {submitText}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <Modal
        onRequestClose={this._onCancelPress}
        transparent={true}
        visible={this.props.visible}
      >
        {this._renderDialog()}
      </Modal>
    );
  }
}
