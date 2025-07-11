import React, { use, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PasswordModal from "./PasswordModal";
import bcrypt from "bcryptjs";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { useUpdateRoomMutation } from "../redux/api/roomApiSlice";

const RoomAccessGuard = ({ room, isLoading, children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [rejected, setRejected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { userinfo } = useSelector((state) => state.auth);
  const [updateparticipants] = useUpdateRoomMutation();
  

  const addusertoparticipants = async() =>{
    // if(!room)console.log("cant acess room right now!");
    // console.log(typeof(room.participants[0]._id));
    // console.log('updatedparticipants', updatedparticipants)
    
    if(room.participants.some(p => p._id===userinfo.id) || room.author._id === userinfo.id)
      return
    
    try {
      const updatedparticipants = [...room.participants,userinfo.id];
      await updateparticipants({id:room._id , data:{participants:updatedparticipants}})
      // refetch();
    } catch (error) {
      console.error(error);
    }

  }
  useEffect(() => {
    if (!room) return;
    if (room.password) {
      
      setShowModal(true);
    } else {
      addusertoparticipants();
      setIsAuthorized(true);
      
    }
  }, [room]);

  const navigate = useNavigate();

  const isparticipant = room?.participants?.some(
    (user) => user._id === userinfo.id
  );
  const isauthor = room?.author?._id === userinfo.id;

  useEffect(() => {
    if (isauthor || isparticipant) setIsAuthorized(true);
  }, [isauthor, isparticipant]);

  

  if (isLoading) return <Loader />;

  // console.log('showModal', showModal);
  // console.log('isAuthorized', isAuthorized);
  // console.log('isparticipant', isparticipant)
  // console.log('isauthor', isauthor)

  const handlePasswordSubmit = async (password) => {
    const match = await bcrypt.compare(password, room.password);
    if (match) {
      addusertoparticipants();
      setIsAuthorized(true);
      setShowModal(false);
    } else {
      setRejected(true);
    }
  };

  if (rejected) return <Navigate to="/" replace />;
  if (!isAuthorized) {
    return (
      <div className="relative min-h-screen">
        <div className="backdrop-blur-sm bg-black/30 fixed inset-0 z-10" />
        <PasswordModal
          isOpen={showModal}
          onSubmit={handlePasswordSubmit}
          onClose={() => {
            navigate("/", { replace: true });
          }}
        />
      </div>
    );
  } else return <>{children}</>;
};

export default RoomAccessGuard;
