class TimeboxCreator extends React.Component {
  state = {
    title: "",
    totalTimeInMinutes: "",
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  addTimebox = () => {
    const { title, totalTimeInMinutes } = this.state;
    if (title.length < 3 || totalTimeInMinutes <= 0) return;
    this.props.onCreate({
      id: uuid.v4(),
      title,
      totalTimeInMinutes,
      editable: false,
    });
    this.setState({
      title: "",
      totalTimeInMinutes: "",
    });
  };

  render() {
    const { title, totalTimeInMinutes } = this.state;
    const { editMode } = this.props;
    return (
      <div className={`TimeboxCreator ${editMode ? "inactive" : ""}`}>
        <label>
          Co robisz?
          <input
            // disabled={!editMode}
            value={title}
            type="text"
            name="title"
            onChange={this.handleChange}
          />
        </label>
        <br />
        <label>
          Ile minut?
          <input
            // disabled={!editMode}
            value={totalTimeInMinutes}
            type="number"
            name="totalTimeInMinutes"
            onChange={this.handleChange}
          />
        </label>
        <br />
        <button onClick={this.addTimebox}>dodaj timebox</button>
      </div>
    );
  }
}

class TimeboxList extends React.Component {
  state = {
    editMode: false,
    timeboxes: [
      {
        id: "a",
        title: "uczę sie reacta",
        totalTimeInMinutes: 10,
      },
      {
        id: "b",
        title: "uczę sie laravela",
        totalTimeInMinutes: 23,
      },
      {
        id: "c",
        title: "uczę sie js es6",
        totalTimeInMinutes: 22,
      },
    ],
  };

  addTimebox = (timebox) => {
    this.setState((prevState) => {
      const timeboxes = [timebox, ...prevState.timeboxes]; // dodajemy element na początku tablicy
      return { timeboxes };
    });
  };

  handleCreate = (createdTimebox) => {
    this.addTimebox(createdTimebox);
  };

  handleDelete = ({ id }) => {
    this.setState((prevState) => ({
      timeboxes: prevState.timeboxes.filter((timebox) => timebox.id !== id),
    }));
  };

  handleEdit = (timebox) => {
    this.setState({
      timebox,
      editMode: true,
      currentEditTimebox: timebox.id,
    });
  };

  cancelEdit = () => {
    this.setState({
      editMode: false,
      currentEditTimebox: null,
    });
  };

  handleUpdate = (updatedTimebox) => {
    this.setState((prevState) => {
      const timeboxes = prevState.timeboxes.map((timebox) =>
        timebox.id === updatedTimebox.id ? updatedTimebox : timebox
      );
      return { timeboxes, editMode: false, currentEditTimebox: null };
    });
  };

  render() {
    const { editMode, currentEditTimebox } = this.state;
    return (
      <>
        <TimeboxCreator onCreate={this.handleCreate} editMode={editMode} />
        {this.state.timeboxes.map((timebox) => (
          <Timebox
            key={timebox.id}
            timebox={timebox}
            onDelete={() => this.handleDelete(timebox)}
            onEdit={() => this.handleEdit(timebox)}
            onUpdate={this.handleUpdate}
            editMode={editMode}
            currentEditTimebox={currentEditTimebox}
            cancelEdit={this.cancelEdit}
          />
        ))}
      </>
    );
  }
}

function Timebox({
  timebox,
  onDelete,
  onEdit,
  onUpdate,
  editMode,
  currentEditTimebox,
  cancelEdit,
}) {
  const { id, title, totalTimeInMinutes } = timebox;
  return (
    <div className="Timebox">
      <h3>
        {title} - {totalTimeInMinutes} min.
      </h3>
      {currentEditTimebox !== id ? (
        <>
          <button onClick={onDelete} disabled={editMode}>
            usuń
          </button>
          <button onClick={onEdit} disabled={editMode}>
            zmień
          </button>
        </>
      ) : (
        <EditTimebox
          timebox={timebox}
          onUpdate={onUpdate}
          onEdit={onEdit}
          cancelEdit={cancelEdit}
        />
      )}
    </div>
  );
}

class EditTimebox extends React.Component {
  state = {
    title: this.props.timebox.title,
    totalTimeInMinutes: this.props.timebox.totalTimeInMinutes,
  };

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  update = () => {
    const { title, totalTimeInMinutes } = this.state;
    const { timebox, onUpdate } = this.props;
    if (title.length < 3 || totalTimeInMinutes <= 0) return;
    onUpdate({
      ...timebox,
      title,
      totalTimeInMinutes,
    });
  };

  render() {
    const { cancelEdit } = this.props;
    const { title, totalTimeInMinutes } = this.state;
    return (
      <div className="TimeboxEditor">
        <label>
          Co robisz?
          <input
            type="text"
            value={title}
            onChange={this.handleInputChange}
            name="title"
          />
        </label>
        <br />
        <label>
          Ile minut?
          <input
            type="number"
            value={totalTimeInMinutes}
            onChange={this.handleInputChange}
            name="totalTimeInMinutes"
          />
        </label>
        <br />
        <button onClick={this.update} type="submit">
          edytuj
        </button>
        <button onClick={cancelEdit}>anuluj</button>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TimeboxList />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
