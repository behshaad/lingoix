const ResourceCard = ({ title, description, link }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500"
      >
        مشاهده منبع
      </a>
    </div>
  );
};

export default ResourceCard;
