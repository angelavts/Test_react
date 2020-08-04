import React, {useState, useEffect} from 'react';
//useEffect permite ejecutar codigo despues del renderizado del componente
const API = process.env.REACT_APP_API;
export const Users = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [editing, setEditing] = useState(false);
    const [id, setId] = useState('');
    const [users, setUsers] = useState([]);
    // recibe como parametro un evento
    const handleSubmit = async (e) => {
        // para que no se reinicie la página al presionar submit
        e.preventDefault();
        //enviar peticion http
        // await para indicar que es un método asíncrono 
        // async: palabra clave para que funcione el await
        if(editing){
            const response = await fetch(`${API}/user/${id}`, {
                method: 'PUT',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            const data = await response.json();
            console.log(data);
            setEditing(false);
            setId('');
        }else{
            const response = await fetch(`${API}/users`,{
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });
            const data = await response.json();
            console.log(data);
        }
        
        
        await getUsers();
        setName('');
        setEmail('');
        setPassword('');
    }
    const editUser = async (id) => {
        const response = await fetch(`${API}/user/${id}`, {
            method: 'GET'
        });
        const data = await response.json();
        setEditing(true);
        setId(data._id);
        setName(data.name);
        setEmail(data.email);
        setPassword(data.password);
    }
    const deleteUser = async (id) => {
        const userResponde = window.confirm('Are you sure you want to deleted?');
        if (userResponde) {
            const response = await fetch(`${API}/user/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            console.log(data);
            await getUsers();
        }
        
        // volverá a traer datos y react se encargará de ver si ha cambiado o no
    }


    const getUsers = async () => {
        // por defect el fetch hace peticiones get
        const response = await fetch(`${API}/users`);
        const data = await response.json();
        setUsers(data); // se esta guardando una lista
        console.log(data);
    }

    useEffect( () => {
        getUsers();
    }, [] );

    return(
        <div className="row">
            <div className="col-md-4">
                <form onSubmit={handleSubmit} className="card card-body">
                    <div className="form-group">
                        <input 
                            type="text" 
                            onChange={e => setName(e.target.value)} 
                            value={name}
                            className="form-control"
                            placeholder="Name"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            onChange={e => setEmail(e.target.value)} 
                            value={email}
                            className="form-control"
                            placeholder="Email"
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            onChange={e => setPassword(e.target.value)} 
                            value={password}
                            className="form-control"
                            placeholder="password"
                        />
                    </div>
                    <button className="btn btn-primary btn-block">
                        {editing ? 'UPDATE' : 'CREATE'}
                    </button>

                </form>
            </div>
            <div className="col-md-8">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Operations</th>
                        </tr>

                    </thead>                
                    <tbody>
                    {users.map( user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>
                                <button 
                                    className="btn btn-secondary btn-sm btn-block"
                                    onClick={ () => editUser(user._id) }
                                    >
                                    Edit
                                </button>
                                <button className="btn btn-danger btn-sm btn-block"
                                    onClick={ () => deleteUser(user._id) }
                                    >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>
        </div>
    )
}