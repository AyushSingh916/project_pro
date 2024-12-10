
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../lib/auth";


const User = async () => {
    const session = await getServerSession(NEXT_AUTH);
    return <div>
        {JSON.stringify(session)}
    </div>
}

export default User;