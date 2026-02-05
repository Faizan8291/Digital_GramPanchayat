import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slice";




export default function LogOutComp()
{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    localStorage.clear();
    dispatch(logout())
    navigate("/")
}

