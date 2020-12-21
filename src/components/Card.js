import React from 'react';
import { Switch, Text, View } from 'react-native';

export const Card = (props) => {
    const {
        title,
        onValueChange,
        value,
        children,
        ...attributes
    } = props;

    return (
        <View
            style={styles.card}
            {...attributes}
        >
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    {title &&
                    <Text style={styles.title}>{title}</Text>
                    }
                </View>
                <Switch onValueChange={onValueChange} value={value} height={20} />
            </View>
            <View>
                {children}
            </View>
        </View>
    )
};

const  styles = {
    card: {
        backgroundColor: '#FFF',
        padding: 15,
        marginHorizontal: 14,
        marginTop: 14,
        borderRadius: 5,
        height: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    }
};