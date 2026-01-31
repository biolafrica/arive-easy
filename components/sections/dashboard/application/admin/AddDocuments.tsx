import Modal from "@/components/common/ContentModal";

export default function AddDocuments({showModal, setShowModal}:{
  showModal:boolean
  setShowModal:(value:boolean)=>void
}){
  
  return(
    <div>
      <Modal
        onClose={()=>setShowModal(false)}
        isOpen={showModal}
        title="Add Documents"
      >
        <h4>Welcome To Documents</h4>
        
      </Modal>
    </div>
  )
}