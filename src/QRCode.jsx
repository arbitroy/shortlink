import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// QR Code Component using qrcode.react
const QRCode = ({ value, size = 200, level = 'M', bgColor = '#ffffff', fgColor = '#000000' }) => {
    return (
        <QRCodeSVG
            value={value}
            size={size}
            level={level}
            bgColor={bgColor}
            fgColor={fgColor}
            includeMargin={true}
        />
    );
};

export default QRCode;