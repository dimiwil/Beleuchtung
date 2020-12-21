/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  ImageBackground,
    Text,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { ColorPicker, fromHsv, toHsv } from 'react-native-color-picker';
import tinycolor from 'tinycolor2'
import mqttConnect from './src/MQTTConnection';
import {LIGHTS} from './src/assets';

import { Buffer } from 'buffer';
import { Card } from './src/components/Card';

global.Buffer = Buffer; // very important

const App = () => {

  const [mqttCon, setMqttCon] = useState();

  useEffect(() => {

    mqttConnect.connect('192.168.178.118', 9001 );
    setMqttCon(mqttConnect);

    return () => {
      mqttConnect.close()
    }
  }, [setMqttCon]);

  const [all, setAll] = useState(false);

  const [isLEDEnabled, enableLED] = useState(false);
  const [color, setColor] = useState(toHsv('#FF7700'));
  const [oldColor, setOldColor] = useState(toHsv('#FF7700'));

  const [licht1, setLicht1] = useState(0);
  const [licht2, setLicht2] = useState(false);

  const toggleAll = (on) => {
    setAll(on);
    changeLicht1(on);
    toggleLED(on);
  };

  const onLichtChange = (value) => {
    setLicht1(value);
    const light = {
      set: value,
    };
    mqttCon.send("zimmer/samira/licht1/set", JSON.stringify(light));
  };

  const changeLicht1 = (value) => {
    const licht = value ? 255 : 0;
    setLicht1(licht);
    const light = {
      set: licht,
    };
    mqttCon.send("zimmer/samira/licht1/set", JSON.stringify(light));
  };

  const onColorChange = (newColor) => {
    setColor(newColor);
    mqttCon.send("zimmer/samira/led/set", JSON.stringify(getRGBColor()));
  };

  const onColorSelected = () => {
    setOldColor(color);
    mqttCon.send("zimmer/samira/led/set", JSON.stringify(getRGBColor()));
    enableLED(false);
  };

  const toggleLED = (on) => {
    enableLED(on);
    console.log("isEnabledLED", on);
    mqttCon.send("zimmer/samira/led/set", on ? JSON.stringify(getRGBColor()) : '{ "red": 0, "green": 0, "blue": 0}');
  };

  const getRGBColor = () => {
    const replacements = {'r': 'red', 'g': 'green', 'b': 'blue'};
    const tinyRGB = tinycolor(color).toRgb();
    let replaced = Object.keys(tinyRGB).map((key) => {
      const newKey = replacements[key] || key;
      return { [newKey] : tinyRGB[key]};
    });
    return replaced.reduce((a,b) => Object.assign({}, a, b));
  };

  return (
    <>
      <StatusBar />
      <ImageBackground source={LIGHTS} style={styles.headerImg}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Beleuchtung</Text>
        </View>
      </ImageBackground>
      <View style={{ backgroundColor: 'gray', height: '100%'}}>

        <Card onValueChange={toggleAll} value={all} />
        <Card title="LEDs" onValueChange={toggleLED} value={isLEDEnabled} />

        <View style={{ height: 200}}>
          <ColorPicker
              color={color}
              onColorChange={onColorChange}
              onColorSelected={onColorSelected}
              style={{flex: 1, height: 100}}
              hideSliders={true}
          />
        </View>

        <Card title="Licht1"onValueChange={changeLicht1} value={licht1 > 0} height={100}>
        <Slider
          style={{ height: 40 }}
          minimumValue={0}
          maximumValue={255}
          minmumTrackTintColor='#000000'
          maximumTrackTintColor='#000000'
          onValueChange={onLichtChange}
          value={licht1}
        />
        </Card>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  headerImg: {
    height: 100,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff'
  }
});

export default App;
