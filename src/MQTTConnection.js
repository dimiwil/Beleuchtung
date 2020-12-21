import MQTTConnection from './lib/MQTTConnection';

const mqttConnect = new MQTTConnection();

const onMQTTConnect = () => {
    console.log('App onMQTTConnect');
    mqttConnect.subscribeChannel('zimmer/samira/led/set');
};

const onMQTTLost = (error) => {
    console.log('App onMQTTLost');
    console.log(error);
};

const onMQTTMessageArrived = (message) => {
    console.log('App onMQTTMessageArrived: ', message);
    console.log('App onMQTTMessageArrived payloadString: ', message.payloadString);
};

const onMQTTMessageDelivered = (message) => {
    console.log('App onMQTTMessageDelivered: ', message);
};

mqttConnect.onMQTTConnect = onMQTTConnect;
mqttConnect.onMQTTLost = onMQTTLost;
mqttConnect.onMQTTMessageArrived = onMQTTMessageArrived;
mqttConnect.onMQTTMessageDelivered = onMQTTMessageDelivered;

export default mqttConnect;

