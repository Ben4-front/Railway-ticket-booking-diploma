import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'antd';

import serviceNames from '../serviceNames';

import 'antd/dist/antd.css';
import './Popover.scss';

function CoachServiceItem({
   name,
   included,
   text,
   inactive,
   hover,
   active,
   className,
}) {
   let initialState;
   switch (name) {
      case serviceNames.food:
         initialState = 'inactive';
         break;
      case serviceNames.linens:
         initialState = included ? 'active' : 'inactive';
         break;
      default:
         initialState = 'active';
   }

   const [img, setImg] = useState(initialState);

   const mouseEnterHandler = () => {
      setImg('hover');
   };
   const mouseLeaveHandler = () => {
      setImg(initialState);
   };

   let icon;
   switch (img) {
      case 'active':
         icon = active;
         break;
      case 'hover':
         icon = hover;
         break;
      default:
         icon = inactive;
   }

   let title;
   switch (name) {
      case serviceNames.linens:
         title = !included ? text : name;
         break;
      case serviceNames.food:
         title = text;
         break;
      default:
         title = name;
   }

   return (
      <Tooltip
         overlayClassName="icons-tooltip"
         title={title}
         placement="bottom"
      >
         <div
            className={className}
            onMouseEnter={mouseEnterHandler}
            onMouseLeave={mouseLeaveHandler}
         >
            <img src={icon} alt={`иконка ${name}`} />
         </div>
      </Tooltip>
   );
}

CoachServiceItem.propTypes = {
   className: PropTypes.node.isRequired,
   name: PropTypes.string.isRequired,
   inactive: PropTypes.node,
   hover: PropTypes.node.isRequired,
   active: PropTypes.node,
   included: PropTypes.bool,
   text: PropTypes.string,
};
CoachServiceItem.defaultProps = {
   inactive: null,
   active: null,
   included: null,
   text: null,
};

export default CoachServiceItem;
