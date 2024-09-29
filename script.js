const { useState, useEffect, useRef } = React;

const AlarmApp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  //Date and time
  const day = currentTime.getDate().toString().padStart(2, '0');
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
  const year = currentTime.getFullYear();
  const hour = currentTime.getHours().toString().padStart(2, '0');
  const minute = currentTime.getMinutes().toString().padStart(2, '0');
  const second = currentTime.getSeconds().toString().padStart(2, '0');

  //Alarms
  const [alarms, setAlarms] = useState([]);
  const [newAlarm, setNewAlarm] = useState('');
  const [isTriggered, setIsTriggered] = useState(false);
  const alarmSound = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add alarm
  const addAlarm = () => {
    if (newAlarm) {
      setAlarms([...alarms, new Date(newAlarm)]);
      setNewAlarm(''); 
      }
    };

  // Delete alarm
  const deleteAlarm = (index) => {
    setAlarms(alarms.filter((_, i) => i !== index));
  };

  useEffect(() => {
    alarms.forEach((alarm, index) => {
      if (currentTime >= alarm) {
        setIsTriggered(true); 
        alarmSound.current.play();

        setTimeout(() => {
          alarmSound.current.pause();
          alarmSound.current.currentTime = 0;
        }, 5000);
        alert(`Alarme ${index + 1} déclenchée!`);
        deleteAlarm(index);

        setTimeout(() => {
          setIsTriggered(false);
        },5000);
      }
    });
  }, [currentTime, alarms]);

  return (
          React.createElement('div', { className: 'clock-container' },
            React.createElement('h1', null, 'Mon alarme digitale'),
            React.createElement('div', null,
              React.createElement('h3', { className: 'date-title' }, 'Date'),
              React.createElement('p', null, `${day}/${month}/${year}`)
            ),
            React.createElement('div', null,
              React.createElement('h3', { className: 'time-title' }, 'Heure'),
              React.createElement('p', null, `${hour}:${minute}:${second}`)
            ),
            React.createElement('div', { className: 'add-delet-alarm'}, 
              React.createElement('h2', null, 'Créer une nouvelle alarme'),
              React.createElement('input', {
                type: 'datetime-local',
                value: newAlarm,
                onChange: (e) => setNewAlarm(e.target.value)
                }),
              React.createElement('button', { onClick: addAlarm, className: 'button-create-alarm' }, 'Ajouter Alarme')
            ),
            React.createElement('h2', null, 'Liste des alarmes'),
            alarms.length === 0
              ? React.createElement('p', null, 'Aucune alarme programmée.')
              : React.createElement('ul', null,
                  alarms.map((alarm, index) => (
                    React.createElement('li', { key: index },
                      alarm.toLocaleString(),
                    React.createElement('button', {
                      onClick: () => deleteAlarm(index),
                      className: 'button-delete-alarm'
                      }, 'Supprimer')
                    )
                  ))
                ),
              React.createElement('audio', {
                ref: alarmSound,
                src: './audio/tropical-alarm-clock.mp3',
                preload: 'auto'
              }),
              isTriggered && React.createElement('div', { className: 'alarm-triggered' }, '🚨 Alarme déclenchée ! 🚨')
          )
        );
};

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(AlarmApp));