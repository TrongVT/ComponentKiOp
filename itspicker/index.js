import React from "react";
import { PropTypes } from "prop-types";
import {
  View,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  ViewPropTypes
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

let componentIndex = 0;

const propTypes = {
  disabled: PropTypes.bool,
  data: PropTypes.array,
  onChange: PropTypes.func,
  initValue: PropTypes.string,
  style: (ViewPropTypes || View.propTypes).style,
  selectStyle: ViewPropTypes.style,
  optionStyle: ViewPropTypes.style,
  optionTextStyle: Text.propTypes.style,
  sectionStyle: (ViewPropTypes || View.propTypes).style,
  sectionTextStyle: Text.propTypes.style,
  cancelStyle: ViewPropTypes.style,
  cancelTextStyle: Text.propTypes.style,
  overlayStyle: ViewPropTypes.style,
  cancelText: PropTypes.string
};

const defaultProps = {
  disabled: false,
  data: [],
  onChange: () => {},
  initValue: "Select me!",
  style: {},
  selectStyle: {},
  optionStyle: {},
  optionTextStyle: {},
  sectionStyle: {},
  sectionTextStyle: {},
  cancelStyle: {},
  cancelTextStyle: {},
  overlayStyle: {},
  cancelText: "cancel"
};

export default class ModalPicker extends React.Component {
  constructor() {
    super();
    this.state = {
      animationType: "slide",
      modalVisible: false,
      transparent: false,
      selected: "please select"
    };
  }

  covertlabel(value) {
    let lb = "";
    this.props.data.forEach(element => {
      if (element.value === value) {
        lb = element.label;
        return;
      }
    });

    return lb;
  }

  componentDidMount() {
    this.setState({ selected: this.props.initValue });
    this.setState({ cancelText: this.props.cancelText });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initValue != this.props.initValue) {
      this.setState({ selected: nextProps.initValue });
    }
  }
  onChange(item) {
    if (!this.props.disabled) {
      this.props.onChange(item);
      this.setState({ selected: item.value });
      this.close();
    }
  }

  close() {
    this.setState({
      modalVisible: false
    });
  }

  open() {
    if (!this.props.disabled) {
    this.setState({
      modalVisible: true
    });
  }
  }

  renderSection(section, i) {
    return (
      <View
        key={`modalPickersectopn${i}`}
        style={[
          {
            padding: 8 * 2,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc"
          },
          this.props.sectionStyle
        ]}
      >
        <Text
          style={[
            {
              textAlign: "center",
              fontSize: 16
            },
            this.props.sectionTextStyle
          ]}
        >
          {section.label}
        </Text>
      </View>
    );
  }

  renderOption(option, i) {
    return (
      <TouchableOpacity
        key={`modalPickeroption${i}`}
        onPress={() => this.onChange(option)}
      >
        <View
          style={[
            {
              padding: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc"
            },
            this.props.optionStyle
          ]}
        >
          <Text
            style={[
              {
                textAlign: "center",
                fontSize: 16,
                color: "rgba(0, 118, 255, 0.9)"
              },
              this.props.optionTextStyle
            ]}
          >
            {option.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderOptionList() {
    var options = this.props.data.map((item, i) => {
      if (item.section) {
        return this.renderSection(item, i);
      } else {
        return this.renderOption(item, i);
      }
    });

    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            padding: 20
          },
          this.props.overlayStyle
        ]}
        key={"modalPicker" + componentIndex}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 5,
            backgroundColor: "rgba(255,255,255,0.8)"
          }}
        >
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={{ paddingHorizontal: 10 }}>{options}</View>
          </ScrollView>
        </View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity onPress={() => this.close()}>
            <View
              style={[
                {
                  borderRadius: 5,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  padding: 8
                },
                this.props.cancelStyle
              ]}
            >
              <Text
                style={[
                  {
                    textAlign: "center",
                    color: "#333",
                    fontSize: 16
                  },
                  this.props.cancelTextStyle
                ]}
              >
                {this.props.cancelText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.open()}>
        <Modal
          supportedOrientations={["portrait", "landscape"]}
          transparent={true}
          backdropColor="transparent"
          hardwareAccelerated={true}
          ref={picker => (this.picker = picker)}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.state.animationType}
        >
          {this.renderOptionList()}
        </Modal>
          <View
            style={[
              {
                flex: 1,
                height: 30,
                flexDirection: "row",
                alignItems: "center"
              },
              this.props.selectStyle
            ]}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 20,
                height: 30,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <MaterialCommunityIcons
                name="menu-down"
                size={22}
                color="#20b2aa"
              />
            </View>
            <Text
              style={[
                { color: "#333", fontSize: 16, paddingRight: 22 },
                this.props.selectTextStyle
              ]}
            >
              {this.covertlabel(this.state.selected)}
            </Text>
            <Text />
            </View>
        </TouchableOpacity>
    );
  }
}

ModalPicker.propTypes = propTypes;
ModalPicker.defaultProps = defaultProps;
