import React from "react";
import Head from "next/head";

interface PageHeaderProps {
  title: string;
  description: string;
  image?: string;
}

const PageHeader = ({ title, description, image }: PageHeaderProps) => {
  return (
    <Head>
      <title>{title} | DisplayCase</title>
      <meta property="og:title" content={title} key="title" />
      <meta property="og:description" content={description} key="description" />
      <meta property="og:image" content={image} key="image" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default PageHeader;
