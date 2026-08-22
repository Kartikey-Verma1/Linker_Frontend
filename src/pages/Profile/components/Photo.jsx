import { useState } from "react"

const Photo = ({edit, url}) => {
    return (
        <>
            <label className="avatar"
                htmlFor="my_modal_photo">
                <figure className="max-w-30 min-w-17 rounded-full cursor-pointer">
                    <img
                    src={url}
                    alt="Profile" />
                </figure>
            </label>
            <input type="checkbox" id="my_modal_photo" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box p-0 max-w-fit max-h-fit">
                    <div className="max-w-sm">
                        <img className="aspect-16/18 object-cover"
                            src={url}
                            alt="profile photo" />
                    </div>
                    <label htmlFor="my_modal_photo" className="p-1 px-2 rounded-full text-gray-500 font-bold cursor-pointer bg-base-100/15 hover:bg-gray-800 absolute right-1 top-1">✕</label>
                </div>
            </div>
        </>
    )
}

export default Photo