import React from 'react';
import Image from 'next/image';
import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';

function ManagementTeam() {
    return (
        <div className='managementTeam_main'>
            <div className='imgBox'>
                <Image
                    src="/assets/img/teamPerson.png"
                    alt="image"
                    width={1000}
                    height={1000}
                    unoptimized
                />
            </div>
            <div className='contentBox'>
                <h5>Aamal Q.P.S.C</h5>
                <h6>CHIEF EXECUTIVE OFFICER</h6>
                <ul className='iconList'>
                    <li>
                        <a href="#">
                            <FaLinkedinIn />
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FaInstagram />
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FaFacebookF />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default ManagementTeam