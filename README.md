
# Component Kira_SOp
Component for Mobile App ITS

A cross-platform (iOS / Android), selector/picker component for React Native that is highly customizable and supports sections.

## Demo

<img src="https://raw.githubusercontent.com/d-a-n/react-native-modal-picker/master/docs/demo.gif" />

## Install

```sh
npm i componentits
```

## Usage

You can either use this component as an wrapper around your existing component or use it in its default mode. In default mode a customizable button is rendered.

See `SampleApp` for an example how to use this component.

```jsx

import Picker from 'componentits'

[..]
<Picker
            disabled={this.props.item.disabled}
            style={{ flex: 1, marginHorizontal: 2, flexWrap: "wrap" }}
            selectTextStyle={{ fontSize: 10 }}
            placeholder="Error code"
            data={this.props.item.Details}
            initValue={this.props.item.SelectDetail.value}
            onChange={e => this.onChange(e)}
          />

```

## Props

* `data - []` required, array of objects with a unique key and label
* `style - object` optional, style definitions for the root element
* `onChange - function` optional, callback function, when the users has selected an option
* `initValue - string` optional, text that is initially shown on the button
* `cancelText - string` optional, text of the cancel button
* `selectStyle - object` optional, style definitions for the select element (available in default mode only!)
* `selectTextStyle - object` optional, style definitions for the select element (available in default mode only!)
* `overlayStyle - object` optional, style definitions for the overly/background element
* `sectionStyle - object` optional, style definitions for the section element
* `sectionTextStyle - object` optional, style definitions for the select text element
* `optionStyle - object` optional, style definitions for the option element
* `optionTextStyle - object` optional, style definitions for the option text element
* `cancelStyle - object` optional, style definitions for the cancel element
* `cancelTextStyle - object` optional, style definitions for the cancel text element
