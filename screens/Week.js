import React from 'React';
import { ScrollView, View, Text } from 'react-native';
import { Header, Button } from 'react-native-elements';
import update from 'react-addons-update';
import * as firebase from 'firebase';
import moment from 'moment';

export default class WeekScreen extends React.Component {
  static navigationOptions = {
    title: 'Weekly View'
  };

  constructor(props) {
    super(props);
    this.state = {
      week: []
    };
  }

  componentWillMount() {
    this.setupWeek();
  }

  setupWeek() {
    let currentDate = new Date();

    this.state.week = [];

    for (let i = 1; i <= 7; i++) {
      let first = currentDate.getDate() - currentDate.getDay() + i;
      let name = new Date(currentDate.setDate(first))
        .toISOString()
        .slice(0, 10);
      this.state.week.push({
        name,
        events: []
      });
    }

    this.state.week.map((day, index) => {
      firebase
        .database()
        .ref('days/' + day.name)
        .once('value')
        .then(
          snapshot => {
            let week = this.state.week;
            var events = [];
            snapshot.forEach(ss => {
              events.push(ss.val());
            });
            week[index].events = events;
            this.setState({ week });
          },
          err => {
            console.error('Error: ', err);
          }
        );
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
          {this.state.week.map((day, i) => {
            return day.events.length > 0 ? (
              <View key={JSON.stringify(day)} style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 25 }}>
                  {moment(day.name).format('dddd Do MMMM')}
                </Text>
                {this.state.week[i].events.map(event => {
                  return (
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10
                      }}
                      key={JSON.stringify(event)}
                    >
                      <View style={{ width: '65%' }}>
                        <Text>
                          {event.hours} hours
                          {event.minutes > 0
                            ? `, ${event.minutes} minutes`
                            : ''}
                        </Text>
                        <Text>{event.location}</Text>
                      </View>
                      <Button
                        buttonStyle={{
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          marginRight: 5
                        }}
                        title="Edit"
                      />
                      <Button
                        buttonStyle={{
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          backgroundColor: 'red'
                        }}
                        title="Delete"
                      />
                    </View>
                  );
                })}
              </View>
            ) : null;
          })}
          <Button
            buttonStyle={{ marginVertical: 30 }}
            type="outline"
            title="SYNC"
            onPress={this.setupWeek.bind(this)}
          />
        </View>
      </ScrollView>
    );
  }
}
