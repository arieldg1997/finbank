from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, IntegerType, StringType, FloatType, BooleanType
import argparse
import json

def map_type(type_str):
    type_mapping = {
        "int": IntegerType(),
        "string": StringType(),
        "float": FloatType(),
        "boolean": BooleanType()
    }
    return type_mapping.get(type_str, StringType())

def main(bucket, path, mode, columns):
    spark = SparkSession.builder.appName("CSV-to-Parquet").getOrCreate()
    inbound_path = f"s3://{bucket}/{path}"
    staging_path = f"s3://{bucket}/staging/{path.split('/')[-1].split('.')[-2]}"

    print(f"Leyendo archivo CSV desde {inbound_path}")
    
    columns = json.loads(columns)
    
    schema = StructType([StructField(col["Name"], map_type(col["Type"]), True) for col in columns])
    
    df = spark.read.option("header", "true").schema(schema).csv(inbound_path)

    df.show()

    print(f"Guardando archivo Parquet")
    
    df.write.mode(mode).parquet(staging_path)

    print("Proceso de conversión a Parquet completado.")

    spark.stop()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--bucket', required=True)
    parser.add_argument('--path', required=True)
    parser.add_argument('--mode', required=False, default='overwrite')
    parser.add_argument('--columns', required=True)

    args = parser.parse_args()
    main(args.bucket, args.path, args.mode, args.columns)
